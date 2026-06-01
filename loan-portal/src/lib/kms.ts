import { KMSClient, GenerateDataKeyCommand, DecryptCommand } from "@aws-sdk/client-kms"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const kms = new KMSClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function encryptFile(fileBuffer: Buffer) {
  const { Plaintext, CiphertextBlob } = await kms.send(
    new GenerateDataKeyCommand({
      KeyId: process.env.AWS_KMS_KEY_ID!,
      KeySpec: "AES_256",
    })
  )
  if (!Plaintext || !CiphertextBlob) throw new Error("KMS key generation failed")

  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(Plaintext), iv)
  const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()])
  const authTag = cipher.getAuthTag()

  return {
    encryptedData: encrypted,
    encryptedKey: Buffer.from(CiphertextBlob).toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  }
}

export async function decryptFile(
  encryptedData: Buffer,
  encryptedKey: string,
  iv: string,
  authTag: string
) {
  const { Plaintext } = await kms.send(
    new DecryptCommand({
      CiphertextBlob: Buffer.from(encryptedKey, "base64"),
    })
  )
  if (!Plaintext) throw new Error("KMS decryption failed")

  const decipher = createDecipheriv(
    "aes-256-gcm",
    Buffer.from(Plaintext),
    Buffer.from(iv, "base64")
  )
  decipher.setAuthTag(Buffer.from(authTag, "base64"))
  return Buffer.concat([decipher.update(encryptedData), decipher.final()])
}
