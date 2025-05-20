"use client";

import { useState, useEffect } from 'react';
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { motion } from "motion/react";
import { MessageSquare, Clock, Tag, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import Link from 'next/link';

interface LocalQuestion {
  id: string;
  title: string;
  description: string;
  tokens: number;
  author: {
    walletAddress: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  createdAt: string;
  status: string;
}

export default function QuestionList() {
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load questions from localStorage
    const loadQuestions = () => {
      const storedQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
      setQuestions(storedQuestions.sort((a: LocalQuestion, b: LocalQuestion) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setLoading(false);
    };

    loadQuestions();
    // Listen for changes in localStorage
    window.addEventListener('storage', loadQuestions);
    return () => window.removeEventListener('storage', loadQuestions);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No questions yet</h3>
        <p className="mt-2 text-sm text-gray-500">Be the first to ask a question!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="flex flex-row items-stretch shadow rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow cursor-pointer px-0 py-0 relative">
            <div className="flex flex-col justify-center items-center px-4 py-4 min-w-[110px] bg-white border-r border-gray-100">
              <div className="flex flex-col items-center mb-4">
                <Button
                  variant="ghost"
                  className="p-0 mb-2"
                  style={{ width: 40, height: 40 }}
                  aria-label="Upvote"
                >
                  <span className="flex items-center justify-center text-blue-600 font-bold">
                    <ThumbsUp size={40} />
                  </span>
                </Button>
                <span className="font-bold text-xl mb-2">0</span>
                <Button
                  variant="ghost"
                  className="p-0"
                  style={{ width: 40, height: 40 }}
                  aria-label="Downvote"
                >
                  <span className="flex items-center justify-center text-gray-400 font-bold">
                    <ThumbsDown size={32}/>
                  </span>
                </Button>
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600 border border-green-400 mb-2 rounded p-2 text-center w-full justify-center">
                <MessageSquare size={16} className="mr-1" />
                0 answers
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 text-center w-full justify-center">
                <Eye size={16} className="mr-1" />
                0 views
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between px-6 py-4">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/question/${question.id}`}
                  className="text-base font-semibold text-blue-700 hover:underline"
                >
                  {question.title}
                </Link>
                <div 
                  className="text-gray-700 text-sm mt-1 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: question.description }}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={question.author.avatar}
                    alt={question.author.name}
                    className="h-6 w-6 rounded-full border border-gray-200"
                  />
                  <span className="text-xs text-gray-700">{question.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {new Date(question.createdAt).toLocaleString()}
                  </span>
                  <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {question.tokens} tokens
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 