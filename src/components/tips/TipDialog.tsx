"use client";

import { useState } from "react";
import { sendTip, SUGGESTED_TIP_AMOUNTS, formatTipAmount, validateTipAmount } from "@/lib/stripe";

interface TipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  creatorName: string;
  videoId?: string;
  currentUserId: string;
}

export function TipDialog({ 
  isOpen, 
  onClose, 
  creatorId, 
  creatorName, 
  videoId, 
  currentUserId 
}: TipDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAmountSelect = (amountCents: number) => {
    setSelectedAmount(amountCents);
    setCustomAmount("");
    setError(null);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const amountCents = Math.round(parseFloat(value) * 100);
    if (!isNaN(amountCents)) {
      setSelectedAmount(amountCents);
    } else {
      setSelectedAmount(null);
    }
    setError(null);
  };

  const handleSendTip = async () => {
    if (!selectedAmount) {
      setError("Please select or enter a tip amount");
      return;
    }

    const validation = validateTipAmount(selectedAmount);
    if (!validation.valid) {
      setError(validation.error || "Invalid tip amount");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sendTip({
        fromUser: currentUserId,
        toUser: creatorId,
        videoId,
        amountCents: selectedAmount,
        currency: 'USD'
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setSelectedAmount(null);
          setCustomAmount("");
          setMessage("");
        }, 2000);
      } else {
        setError(response.error || "Failed to send tip");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send tip");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setSelectedAmount(null);
      setCustomAmount("");
      setMessage("");
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Tip {creatorName}
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Tip Sent!</h4>
            <p className="text-gray-400">
              Your {formatTipAmount(selectedAmount!)} tip has been sent to {creatorName}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Show your appreciation for {creatorName}'s content with a tip!
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {SUGGESTED_TIP_AMOUNTS.map((amount) => (
                  <button
                    key={amount.value}
                    onClick={() => handleAmountSelect(amount.value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedAmount === amount.value
                        ? 'border-green-500 bg-green-500 bg-opacity-20 text-green-400'
                        : 'border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {amount.label}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    min="0.50"
                    max="1000"
                    step="0.01"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-600 bg-opacity-20 border border-red-600 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {selectedAmount && (
                  <span>Total: {formatTipAmount(selectedAmount)}</span>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendTip}
                  disabled={!selectedAmount || loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Tip'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

