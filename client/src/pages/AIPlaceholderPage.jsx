import React from 'react';
import { Sparkles, Bot, FileText, HelpCircle, Award, PenTool, RotateCw, Calendar, ArrowRight, Lock } from 'lucide-react';
import Button from '../components/Button';

const featureConfigs = {
  'ai-assistant': {
    title: 'AI Study Assistant',
    subtitle: 'Interactive AI tutor for instant concept explanations and code debugging.',
    icon: Bot,
    color: 'bg-blue-600',
    description: 'Ask complex academic questions, receive step-by-step problem resolutions, and get personalized study advice powered by Google Gemini AI.',
  },
  'ai-summarizer': {
    title: 'AI Summarizer',
    subtitle: 'Transform lengthy lecture PDFs, textbooks, and notes into concise summaries.',
    icon: FileText,
    color: 'bg-indigo-600',
    description: 'Upload course documents or paste raw text to extract key bullet points, main arguments, and exam cheat sheets automatically.',
  },
  'quiz-generator': {
    title: 'Quiz Generator',
    subtitle: 'Auto-generate revision quizzes and interactive flashcards from your study topics.',
    icon: HelpCircle,
    color: 'bg-emerald-600',
    description: 'Test your knowledge with multiple-choice, true/false, and short answer quizzes custom-built for Java, DSA, and SQL.',
  },
  'exam-generator': {
    title: 'Exam Generator',
    subtitle: 'Simulate full semester mock examinations tuned to your syllabus.',
    icon: Award,
    color: 'bg-amber-600',
    description: 'Practice under timed conditions with AI-generated mock exams complete with scoring rubrics and detailed solutions.',
  },
  'writing-tutor': {
    title: 'Writing Tutor',
    subtitle: 'Refine academic essays, lab reports, and research papers with AI feedback.',
    icon: PenTool,
    color: 'bg-purple-600',
    description: 'Check grammar, tone, thesis clarity, and citation formatting for top-tier academic submission standards.',
  },
  'paraphraser': {
    title: 'Paraphraser',
    subtitle: 'Rephrase complex definitions, research articles, and notes into clear explanations.',
    icon: RotateCw,
    color: 'bg-[#2563EB]',
    description: 'Improve readability, simplify jargon, and generate multiple rewriting variations without losing original context.',
  },
  'study-planner': {
    title: 'AI Study Planner',
    subtitle: 'Automated study schedule generator based on upcoming exam dates and course workload.',
    icon: Calendar,
    color: 'bg-rose-600',
    description: 'Intelligently allocate revision hours for each subject, balance workload, and automatically adjust schedules based on progress.',
  },
};

const AIPlaceholderPage = ({ featureId = 'ai-assistant' }) => {
  const config = featureConfigs[featureId] || featureConfigs['ai-assistant'];
  const IconComp = config.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${config.color} text-white flex items-center justify-center shadow-lg`}>
              <IconComp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{config.title}</h1>
              <p className="text-slate-500 text-xs">{config.subtitle}</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Phase 3 Coming Soon
          </span>
        </div>
      </div>

      {/* Feature Preview Canvas */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 space-y-8 relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" /> Next Phase AI Integration
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Unlock {config.title} with Google Gemini AI
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {config.description}
          </p>

          <div className="pt-2">
            <Button size="lg" className="bg-[#2563EB] hover:bg-blue-600 text-white" disabled>
              <span>Module Armed for Phase 3</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Ambient background styling */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default AIPlaceholderPage;
