"use client";

import { useParams } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Textarea } from "@workspace/ui/components/textarea";
import { useState, useEffect, useCallback, memo } from "react";
import { toast } from "sonner";
import { useWallet } from "@/hooks/use-wallet";
import { baseUrl } from "@/lib/client";
import { ThumbsUp, ThumbsDown, MessageCircle, Eye, Star, CheckCircle2, Coins } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';
import { motion } from "motion/react";

interface Question {
  id: string;
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
  status: string;
}

interface Answer {
  id: string;
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

const AnswerCard = memo(({ 
  answer, 
  isQuestionAuthor, 
  onAcceptAnswer, 
  onVote 
}: { 
  answer: Answer;
  isQuestionAuthor: boolean;
  onAcceptAnswer: (answerId: string) => void;
  onVote: (answerId: string, type: "up" | "down") => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="mb-4 p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-blue-50" 
            style={{ width: 40, height: 40 }}
            onClick={() => onVote(answer.id, "up")}
          >
            <ThumbsUp size={24} className="text-blue-600" />
          </Button>
          <span className="font-semibold">{answer.votes}</span>
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-gray-50" 
            style={{ width: 40, height: 40 }}
            onClick={() => onVote(answer.id, "down")}
          >
            <ThumbsDown size={24} className="text-gray-400" />
          </Button>
        </div>

        <div className="flex-1">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: answer.content }}
          />

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
                <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 flex items-center gap-1">
                  <CheckCircle2 size={16} />
                  Accepted Answer
                </div>
              )}
              {isQuestionAuthor && !answer.isAccepted && (
                <Button
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => onAcceptAnswer(answer.id)}
                >
                  Accept Answer
                </Button>
              )}
              <span className="text-sm text-gray-500">
                Answered on {new Date(answer.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
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
      
      // Load votes and accepted status from localStorage
      const localData = JSON.parse(localStorage.getItem(`question_${id}`) || '{}');
      const updatedData = {
        ...data,
        votes: localData.votes || data.votes,
        answers: data.answers.map((answer: Answer) => ({
          ...answer,
          votes: localData[`answer_${answer.id}_votes`] || answer.votes,
          isAccepted: localData[`answer_${answer.id}_accepted`] || answer.isAccepted
        }))
      };
      
      setQuestion(updatedData);
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

  const handleVote = useCallback((answerId: string, type: "up" | "down") => {
    if (!question) return;

    const updatedAnswers = question.answers.map(answer => {
      if (answer.id === answerId) {
        return {
          ...answer,
          votes: answer.votes + (type === "up" ? 1 : -1)
        };
      }
      return answer;
    });

    setQuestion(prev => prev ? {
      ...prev,
      answers: updatedAnswers
    } : null);

    // Save to localStorage
    const localData = JSON.parse(localStorage.getItem(`question_${id}`) || '{}');
    localStorage.setItem(`question_${id}`, JSON.stringify({
      ...localData,
      [`answer_${answerId}_votes`]: updatedAnswers.find(a => a.id === answerId)?.votes
    }));
  }, [question, id]);

  const handleAcceptAnswer = useCallback((answerId: string) => {
    if (!question || !address || address !== question.author.walletAddress) return;

    const updatedAnswers = question.answers.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId
    }));

    const updatedQuestion = {
      ...question,
      answers: updatedAnswers,
      tokens: 0 // Reset tokens after accepting answer
    };

    setQuestion(updatedQuestion);

    // Save to localStorage
    const localData = JSON.parse(localStorage.getItem(`question_${id}`) || '{}');
    localStorage.setItem(`question_${id}`, JSON.stringify({
      ...localData,
      [`answer_${answerId}_accepted`]: true
    }));

    // Show success message
    toast.success("Answer accepted! Tokens have been transferred to the answerer.");
  }, [question, address, id]);

  const handleSubmitAnswer = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !id || !newAnswer.trim() || !question) return;

    try {
      // Create new answer object
      const newAnswerObj: Answer = {
        id: Date.now().toString(),
        content: newAnswer,
        author: {
          walletAddress: address,
          name: "You",
          avatar: "/avatars/default.png"
        },
        votes: 0,
        isAccepted: false,
        createdAt: new Date().toISOString()
      };

      // Update question with new answer
      const updatedQuestion: Question = {
        ...question,
        answers: [...question.answers, newAnswerObj]
      };

      // Update state
      setQuestion(updatedQuestion);
      setNewAnswer("");

      // Save to localStorage
      const localData = JSON.parse(localStorage.getItem(`question_${id}`) || '{}');
      localStorage.setItem(`question_${id}`, JSON.stringify({
        ...localData,
        answers: updatedQuestion.answers
      }));

      toast.success("Answer submitted successfully!");
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error("Failed to submit answer");
    }
  }, [address, id, newAnswer, question]);

  const handleNewAnswerChange = useCallback((content: string) => {
    setNewAnswer(content);
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

  const isQuestionAuthor = address === question.author.walletAddress;

  return (
    <div className="container mx-auto flex min-h-svh flex-col p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-8 p-6 hover:shadow-lg transition-shadow">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => handleVote(question.id, "up")}
                className="p-0 hover:bg-blue-50"
                style={{ width: 40, height: 40 }}
              >
                <ThumbsUp size={24} className="text-blue-600" />
              </Button>
              <span className="font-semibold text-xl">{question.votes}</span>
              <Button
                variant="ghost"
                onClick={() => handleVote(question.id, "down")}
                className="p-0 hover:bg-gray-50"
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
                    <Coins size={16} />
                    {question.tokens} tokens
                  </div>
                </div>
              </div>

              <div 
                className="mt-4 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />

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
      </motion.div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
          <MessageCircle size={20} className="text-blue-500" />
          {question.answers.length} Answers
        </h2>

        {question.answers.map((answer) => (
          <AnswerCard 
            key={answer.id} 
            answer={answer}
            isQuestionAuthor={isQuestionAuthor}
            onAcceptAnswer={handleAcceptAnswer}
            onVote={handleVote}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mt-8 p-6 hover:shadow-lg transition-shadow">
          <h2 className="mb-4 text-xl font-semibold">Your Answer</h2>
          <form onSubmit={handleSubmitAnswer}>
            <div className="mb-4">
              <Editor
                apiKey="dy7n25j6dc5ptz1vvsl9nmxdzobyxut20g2e2debmf99cuvk"
                value={newAnswer}
                onEditorChange={handleNewAnswerChange}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
                  placeholder: "Write your answer here...",
                  language: 'vi',
                  language_url: '/langs/vi.js',
                }}
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Post Your Answer
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuestionDetailPage;
