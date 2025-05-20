import confetti from "canvas-confetti";
import {
  Bookmark,
  Coins,
  HelpCircle,
  Medal,
  MessageCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import "../styles/question.css";

interface Question {
  _id: string
  title: string
  description: string
  tokens: number
  tags: string[]
  votes: number
  author: {
    walletAddress: string
    name: string
    avatar: string
  }
  views: number
  answers: any[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface UserStatsProps {
  questionsAsked: number
  answersGiven: number
  tokensEarned: number
  badgeLevel: "Bronze" | "Silver" | "Gold" | "Platinum"
  savedQuestions: Question[]
}

const badgeStyles = {
  Bronze:
    "bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 border-yellow-500 shadow-yellow-300",
  Silver:
    "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-700 border-gray-400 shadow-gray-300",
  Gold: "bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-800 border-yellow-600 shadow-yellow-400",
  Platinum:
    "bg-gradient-to-r from-blue-200 to-blue-400 text-blue-800 border-blue-500 shadow-blue-300",
};

const badgeIcons = {
  Bronze: <Medal size={20} className="text-yellow-700" />,
  Silver: <Medal size={20} className="text-gray-500" />,
  Gold: <Medal size={20} className="text-yellow-500" />,
  Platinum: <Medal size={20} className="text-blue-600" />,
};

export default function UserStats({
  questionsAsked,
  answersGiven,
  tokensEarned,
  badgeLevel,
  savedQuestions = []
}: UserStatsProps) {
  const [showBadgeModal, setShowBadgeModal] = useState(false)
  const [animateOut, setAnimateOut] = useState(false)
  const [showSavedDetail, setShowSavedDetail] = useState(false)

  const handleBadgeClick = () => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 1 },
      colors: ["#FFD700", "#C0C0C0", "#CD7F32", "#38bdf8", "#fbbf24"],
    })
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 1 },
      colors: ["#FFD700", "#C0C0C0", "#CD7F32", "#38bdf8", "#fbbf24"],
    })
    setShowBadgeModal(true)
    setAnimateOut(false)
    setTimeout(() => setAnimateOut(true), 2200)
    setTimeout(() => setShowBadgeModal(false), 3000)
  }

  return (
    <div className="relative mb-8">
      {showSavedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm transition-all duration-300">
          <div className="relative w-full max-w-2xl scale-100 transform rounded-2xl bg-white p-6 opacity-100 shadow-2xl transition-all duration-300">
            <button
              className="absolute -right-3 -top-3 rounded-full border-2 border-gray-100 bg-white p-1 text-gray-600 shadow-lg transition-all duration-300 hover:text-blue-500"
              onClick={() => setShowSavedDetail(false)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="mb-6 flex items-center gap-3 border-b pb-4">
              <Bookmark className="text-blue-500" size={24} />
              <span className="text-xl font-bold text-blue-700">
                Your Saved Questions
              </span>
            </div>
            {savedQuestions.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Bookmark size={40} className="mx-auto mb-3 text-gray-300" />
                <p>No saved questions yet.</p>
                <p className="mt-1 text-sm text-gray-400">
                  Start saving interesting questions!
                </p>
              </div>
            ) : (
              <ul className="styled-scrollbar max-h-[60vh] space-y-3 overflow-auto pr-4">
                {savedQuestions.map((q) => (
                  <li key={q._id} className="group">
                    <Link
                      href={`/question/${q._id}`}
                      className="block rounded-lg border border-gray-100 p-4 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50"
                      onClick={() => setShowSavedDetail(false)}
                    >
                      <h3 className="font-medium text-blue-600 group-hover:text-blue-700">
                        {q.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <span>Click to view details</span>
                        <span>•</span>
                        <span>Saved question</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border bg-gradient-to-br from-blue-600 to-cyan-400 p-6 shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="flex min-h-[120px] flex-col items-center justify-between rounded-lg border bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md">
            <span className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
              <HelpCircle className="text-blue-500" size={20} /> Questions Asked
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {questionsAsked}
            </span>
            <button
              className="mt-2 text-xs text-blue-500 hover:underline"
              onClick={() => alert("Show questions asked history (blockchain)...")}
            >
              View History
            </button>
          </div>

          <div className="flex min-h-[120px] flex-col items-center justify-between rounded-lg border bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md">
            <span className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
              <MessageCircle className="text-green-500" size={20} /> Answers Given
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {answersGiven}
            </span>
            <button
              className="mt-2 text-xs text-blue-500 hover:underline"
              onClick={() => alert("Show answers history (blockchain)...")}
            >
              View History
            </button>
          </div>

          <div className="flex min-h-[120px] flex-col items-center justify-between rounded-lg border bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md">
            <span className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
              <Coins className="text-orange-500" size={20} /> Tokens Earned
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {tokensEarned}
            </span>
            <button
              className="mt-2 text-xs text-blue-500 hover:underline"
              onClick={() => alert("Show token earning history (blockchain)...")}
            >
              View History
            </button>
          </div>

          <div className="flex min-h-[120px] flex-col items-center justify-between rounded-lg border bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md">
            <span className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
              <Bookmark className="text-blue-500" size={20} /> Saved Questions
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {savedQuestions.length}
            </span>
            <button
              className="mt-2 text-xs text-blue-500 hover:underline"
              onClick={() => setShowSavedDetail(true)}
            >
              View Details
            </button>
          </div>

          <div className="flex min-h-[120px] flex-col items-center justify-between rounded-lg border bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md">
            <span className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
              <Medal className="text-purple-500" size={20} /> Reputation
            </span>
            <span
              className={`mt-2 flex transform cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 font-semibold transition hover:scale-110 hover:shadow-xl ${badgeStyles[badgeLevel]}`}
              onClick={handleBadgeClick}
            >
              {badgeIcons[badgeLevel]}
              {badgeLevel}
            </span>
          </div>
        </div>
      </div>

      {showBadgeModal && (
        <>
          <div
            className={`fixed inset-0 z-40 transition-all duration-500 ${
              animateOut ? "opacity-0 blur-md" : "opacity-100 blur-sm"
            } pointer-events-none bg-transparent`}
          />
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-transform duration-700 ${
              animateOut ? "badge-modal-out" : "badge-modal-in"
            } `}
            style={{ pointerEvents: "none" }}
          >
            <span
              className={`flex flex-col items-center gap-2 rounded border-2 px-8 py-4 text-2xl font-bold ${badgeStyles[badgeLevel]}`}
              style={{
                borderWidth: 2,
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
              }}
            >
              {badgeIcons[badgeLevel]}
              {badgeLevel} Badge
              <span className="mt-3 text-center text-xs text-gray-600">
                Thank you for your valuable contributions! <br />
                Keep sharing knowledge and help the community grow!
              </span>
            </span>
          </div>
        </>
      )}
    </div>
  )
}
