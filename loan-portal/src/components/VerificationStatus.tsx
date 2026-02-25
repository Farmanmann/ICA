'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Verification, VerificationType } from '@/types/verification';
import { getMyVerifications } from '@/lib/api/verification';

interface VerificationStatusProps {
  showActions?: boolean;
  compact?: boolean;
}

export default function VerificationStatus({
  showActions = true,
  compact = false,
}: VerificationStatusProps) {
  const router = useRouter();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getMyVerifications(token);
      setVerifications(data);
    } catch (err) {
      console.error('Failed to load verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = (type: VerificationType) => {
    const verification = verifications.find((v) => v.verification_type === type);
    return verification;
  };

  const isVerified = (type: VerificationType) => {
    const verification = getVerificationStatus(type);
    return verification?.is_verified || false;
  };

  const requiresAction = (type: VerificationType) => {
    const verification = getVerificationStatus(type);
    return verification?.requires_action || false;
  };

  const allRequiredVerified = () => {
    const requiredTypes: VerificationType[] = ['identity', 'income', 'bank_account', 'sanctions'];
    return requiredTypes.every((type) => isVerified(type));
  };

  const verificationTypes: Array<{
    type: VerificationType;
    label: string;
    icon: string;
    required: boolean;
  }> = [
    { type: 'identity', label: 'Identity Verification', icon: '🆔', required: true },
    { type: 'income', label: 'Income Verification', icon: '💰', required: true },
    { type: 'bank_account', label: 'Bank Account', icon: '🏦', required: true },
    { type: 'sanctions', label: 'Sanctions Check', icon: '🔍', required: true },
    { type: 'fraud', label: 'Fraud Check', icon: '🛡️', required: false },
  ];

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
      </div>
    );
  }

  if (compact) {
    const completedCount = verificationTypes.filter((vt) => isVerified(vt.type)).length;
    const totalRequired = verificationTypes.filter((vt) => vt.required).length;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Verification Status</h3>
            <p className="text-sm text-gray-600">
              {completedCount} of {totalRequired} required verifications completed
            </p>
          </div>
          {allRequiredVerified() ? (
            <span className="text-green-600 font-semibold">✓ All Complete</span>
          ) : (
            <span className="text-yellow-600 font-semibold">Pending</span>
          )}
        </div>
        {showActions && !allRequiredVerified() && (
          <button
            onClick={() => router.push('/borrower/verification')}
            className="mt-3 w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 text-sm"
          >
            Complete Verifications
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Requirements</h3>

      {!allRequiredVerified() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            Please complete all required verifications before submitting your loan application.
          </p>
        </div>
      )}

      {allRequiredVerified() && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 text-sm font-medium">
            ✓ All required verifications completed!
          </p>
        </div>
      )}

      <div className="space-y-3">
        {verificationTypes.map((vt) => {
          const verification = getVerificationStatus(vt.type);
          const verified = isVerified(vt.type);
          const needsAction = requiresAction(vt.type);

          return (
            <div
              key={vt.type}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                verified
                  ? 'bg-green-50 border-green-200'
                  : needsAction
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{vt.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {vt.label}
                    {vt.required && <span className="text-red-500 ml-1">*</span>}
                  </div>
                  {verification && (
                    <div className="text-sm text-gray-600">{verification.status_display}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {verified ? (
                  <span className="text-green-600 font-semibold">✓ Verified</span>
                ) : needsAction && verification?.verification_url ? (
                  <a
                    href={verification.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Complete →
                  </a>
                ) : !verification ? (
                  <span className="text-gray-500 text-sm">Not Started</span>
                ) : (
                  <span className="text-yellow-600 text-sm">Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showActions && (
        <div className="mt-4">
          <button
            onClick={() => router.push('/borrower/verification')}
            className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            {allRequiredVerified() ? 'View Verifications' : 'Start Verifications'}
          </button>
        </div>
      )}
    </div>
  );
}
