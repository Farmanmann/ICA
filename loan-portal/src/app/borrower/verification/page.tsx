'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Verification,
  VerificationType,
  VerificationProvider,
  VerificationCreateRequest,
} from '@/types/verification';
import { getMyVerifications, initiateVerification } from '@/lib/api/verification';

export default function VerificationPage() {
  const router = useRouter();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [initiating, setInitiating] = useState(false);

  const [selectedType, setSelectedType] = useState<VerificationType>('identity');
  const [selectedProvider, setSelectedProvider] = useState<VerificationProvider>('persona');
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const data = await getMyVerifications(token);
      setVerifications(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateVerification = async () => {
    if (!consent) {
      alert('Please provide consent to proceed with verification');
      return;
    }

    setInitiating(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const request: VerificationCreateRequest = {
        verification_type: selectedType,
        provider: selectedProvider,
        user_consent: consent,
      };

      const newVerification = await initiateVerification(request, token);

      // Redirect to verification URL if available
      if (newVerification.verification_url) {
        window.open(newVerification.verification_url, '_blank');
      }

      setShowInitiateModal(false);
      setConsent(false);
      loadVerifications();
    } catch (err: any) {
      setError(err.message || 'Failed to initiate verification');
    } finally {
      setInitiating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'manual_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationIcon = (type: VerificationType) => {
    switch (type) {
      case 'identity':
        return '🆔';
      case 'income':
        return '💰';
      case 'bank_account':
        return '🏦';
      case 'sanctions':
        return '🔍';
      case 'fraud':
        return '🛡️';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Identity Verification</h1>
        <p className="text-gray-600">
          Complete the required verifications to process your loan application
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Required Verifications Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">Required Verifications</h2>
        <p className="text-blue-800 mb-4">
          To complete your loan application, please complete the following verifications:
        </p>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-center">
            <span className="mr-2">🆔</span>
            <strong>Identity Verification:</strong> Verify your identity using an official ID document
          </li>
          <li className="flex items-center">
            <span className="mr-2">💰</span>
            <strong>Income Verification:</strong> Verify your employment and income
          </li>
          <li className="flex items-center">
            <span className="mr-2">🏦</span>
            <strong>Bank Account Verification:</strong> Connect your bank account securely
          </li>
          <li className="flex items-center">
            <span className="mr-2">🔍</span>
            <strong>Sanctions Screening:</strong> Automated compliance check (OFAC/PEP)
          </li>
        </ul>
      </div>

      {/* Start New Verification Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowInitiateModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
        >
          + Start New Verification
        </button>
      </div>

      {/* Verifications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {verifications.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No verifications found. Click "Start New Verification" to begin.
                </td>
              </tr>
            ) : (
              verifications.map((verification) => (
                <tr key={verification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {getVerificationIcon(verification.verification_type)}
                      </span>
                      <span className="font-medium text-gray-900">
                        {verification.verification_type_display}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {verification.provider_display}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        verification.status
                      )}`}
                    >
                      {verification.status_display}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(verification.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {verification.requires_action && verification.verification_url && (
                      <a
                        href={verification.verification_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        Complete Verification →
                      </a>
                    )}
                    {verification.is_verified && (
                      <span className="text-green-600">✓ Verified</span>
                    )}
                    {verification.status === 'failed' && (
                      <span className="text-red-600">Failed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Initiate Verification Modal */}
      {showInitiateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Start New Verification</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as VerificationType)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="identity">Identity Verification</option>
                  <option value="income">Income/Payroll Verification</option>
                  <option value="bank_account">Bank Account Verification</option>
                  <option value="sanctions">Sanctions Screening</option>
                  <option value="fraud">Fraud Check</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as VerificationProvider)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {selectedType === 'identity' && (
                    <>
                      <option value="persona">Persona</option>
                      <option value="trulioo">Trulioo</option>
                      <option value="onfido">Onfido</option>
                    </>
                  )}
                  {selectedType === 'income' && <option value="argyle">Argyle</option>}
                  {selectedType === 'bank_account' && (
                    <>
                      <option value="plaid">Plaid</option>
                      <option value="finicity">Finicity</option>
                    </>
                  )}
                  {(selectedType === 'sanctions' || selectedType === 'fraud') && (
                    <option value="internal">Internal Check</option>
                  )}
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to sharing my information with the verification provider for the
                    purpose of verifying my identity, income, and/or bank account information.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowInitiateModal(false);
                  setError('');
                  setConsent(false);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={initiating}
              >
                Cancel
              </button>
              <button
                onClick={handleInitiateVerification}
                disabled={!consent || initiating}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {initiating ? 'Starting...' : 'Start Verification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
