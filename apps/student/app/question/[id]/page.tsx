"use client";

import { useParams } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { useState, useEffect, useCallback, memo } from "react";
import { toast } from "sonner";
import { useWallet } from "@/hooks/use-wallet";
import { baseUrl } from "@/lib/client";
import { ThumbsUp, ThumbsDown, MessageCircle, Eye, Star } from "lucide-react";

interface Question {
  _id: string;
  title: string;
  description: string;
  tokens: number;
  tags: string[];
  votes: number;
  author: {
    walletAddress: string;
    name: string;
    avatar: string;
  };
  views: number;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Answer {
  content: string;
  author: {
    walletAddress: string;
    name: string;
    avatar: string;
  };
  votes: number;
  isAccepted: boolean;
  createdAt: string;
}

const AnswerCard = memo(({ answer }: { answer: Answer }) => (
  <Card className="mb-4 p-6">
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-2">
        <Button variant="ghost" className="p-0" style={{ width: 40, height: 40 }}>
          <ThumbsUp size={24} className="text-blue-600" />
        </Button>
        <span className="font-semibold">{answer.votes}</span>
        <Button variant="ghost" className="p-0" style={{ width: 40, height: 40 }}>
          <ThumbsDown size={24} className="text-gray-400" />
        </Button>
      </div>

      <div className="flex-1">
        <p className="whitespace-pre-wrap text-gray-700">
          {answer.content}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={answer.author.avatar}
              alt={answer.author.name}
              className="h-8 w-8 rounded-full border border-gray-200"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {answer.author.name}
              </span>
              <span className="text-xs text-gray-500">
                {answer.author.walletAddress.slice(0, 6)}...{answer.author.walletAddress.slice(-4)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {answer.isAccepted && (
              <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                Accepted Answer
              </div>
            )}
            <span className="text-sm text-gray-500">
              Answered on {new Date(answer.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Card>
));

AnswerCard.displayName = 'AnswerCard';

const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { address } = useWallet();
  const [question, setQuestion] = useState<Question | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestionDetails = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/questions/${id}`);
      if (!response.ok) throw new Error("Failed to fetch question");
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error('Error fetching question:', error);
      toast.error("Failed to fetch question");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestionDetails();
  }, [fetchQuestionDetails]);

  const handleVote = useCallback(async (type: "up" | "down") => {
    if (!address || !id) return;

    try {
      const response = await fetch(`${baseUrl}/questions/${id}/vote?type=${type}`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Vote failed");
      await fetchQuestionDetails();
      toast.success("Vote recorded successfully");
    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to record vote");
    }
  }, [address, id, fetchQuestionDetails]);

  const handleSubmitAnswer = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !id) return;

    if (!newAnswer.trim()) {
      toast.error("Answer content is required");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/questions/${id}/answers`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newAnswer,
          author: {
            walletAddress: address,
            name: "You",
            avatar: "/avatars/default.png"
          }
        }),
      });

      if (!response.ok) throw new Error("Failed to submit answer");
      setNewAnswer("");
      await fetchQuestionDetails();
      toast.success("Answer submitted successfully");
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error("Failed to submit answer");
    }
  }, [address, id, newAnswer, fetchQuestionDetails]);

  const handleNewAnswerChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewAnswer(e.target.value);
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container max-w-4xl py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Question not found</h2>
        <p className="text-gray-500 mt-2">The question you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-svh flex-col p-4">
      <Card className="mb-8 p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => handleVote("up")}
              className="p-0"
              style={{ width: 40, height: 40 }}
            >
              <ThumbsUp size={24} className="text-blue-600" />
            </Button>
            <span className="font-semibold text-xl">{question.votes}</span>
            <Button
              variant="ghost"
              onClick={() => handleVote("down")}
              className="p-0"
              style={{ width: 40, height: 40 }}
            >
              <ThumbsDown size={24} className="text-gray-400" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-blue-700">{question.title}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye size={16} />
                  {question.views} views
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <MessageCircle size={16} />
                  {question.answers.length} answers
                </div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star size={16} />
                  {question.tokens} tokens
                </div>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-gray-700">
              {question.description}
            </p>

            <div className="mt-4 flex gap-2 flex-wrap">
              {question.tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs font-medium flex items-center gap-1"
                >
                  <Star size={12} className="text-yellow-400" />
                  {tag}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={question.author.avatar}
                  alt={question.author.name}
                  className="h-8 w-8 rounded-full border border-gray-200"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {question.author.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {question.author.walletAddress.slice(0, 6)}...{question.author.walletAddress.slice(-4)}
                  </span>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                Asked on {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
          <MessageCircle size={20} className="text-blue-500" />
          {question.answers.length} Answers
        </h2>

        {question.answers.map((answer, index) => (
          <AnswerCard key={index} answer={answer} />
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="mb-4 text-xl font-semibold">Your Answer</h2>
        <form onSubmit={handleSubmitAnswer}>
          <Textarea
            value={newAnswer}
            onChange={handleNewAnswerChange}
            placeholder="Write your answer here..."
            className="mb-4 min-h-[200px]"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Post Your Answer
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default QuestionDetailPage;
