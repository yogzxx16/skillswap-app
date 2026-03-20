import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SKILL_OPTIONS } from '../utils/constants';
import { HiLightningBolt, HiX, HiArrowRight, HiSearch } from 'react-icons/hi';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const filteredSkills = SKILL_OPTIONS.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !(step === 1 ? teachSkills : learnSkills).includes(s)
  );

  const addSkill = (skill) => {
    if (step === 1 && teachSkills.length < 5) {
      setTeachSkills([...teachSkills, skill]);
    } else if (step === 2 && learnSkills.length < 5) {
      setLearnSkills([...learnSkills, skill]);
    }
    setSearchTerm('');
  };

  const removeSkill = (skill) => {
    if (step === 1) setTeachSkills(teachSkills.filter(s => s !== skill));
    else setLearnSkills(learnSkills.filter(s => s !== skill));
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      setSearchTerm('');
    } else {
      updateProfile({ teachSkills, learnSkills, onboarded: true });
      navigate('/dashboard');
    }
  };

  const currentSkills = step === 1 ? teachSkills : learnSkills;
  const maxSkills = 5;

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-electric/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-neon-purple/8 rounded-full blur-[150px]" />
      </div>

      <div className="w-full max-w-lg relative z-10 fade-in">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-electric' : 'bg-white/10'} transition-colors`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-electric' : 'bg-white/10'} transition-colors`} />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-electric to-neon-purple mb-4">
            <HiLightningBolt className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 1 ? 'What can you teach?' : 'What do you want to learn?'}
          </h1>
          <p className="text-gray-400">
            {step === 1 ? 'Select up to 5 skills you can share with others' : 'Select up to 5 skills you\'d love to learn'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-6">
          {/* Selected Skills */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
            {currentSkills.map(skill => (
              <span key={skill} className={step === 1 ? 'tag-green' : 'tag-blue'}>
                {skill}
                <button onClick={() => removeSkill(skill)} className="ml-2 hover:opacity-70 bg-transparent border-none cursor-pointer text-inherit">
                  <HiX size={12} />
                </button>
              </span>
            ))}
            {currentSkills.length === 0 && (
              <span className="text-sm text-gray-500 italic">No skills selected yet</span>
            )}
          </div>

          <p className="text-xs text-gray-500 mb-3">{currentSkills.length}/{maxSkills} skills selected</p>

          {/* Search */}
          <div className="relative mb-4">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-navy-800 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-electric transition-colors text-sm"
            />
          </div>

          {/* Skill Options */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
            {filteredSkills.slice(0, 15).map(skill => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                disabled={currentSkills.length >= maxSkills}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          {step === 2 ? (
            <button onClick={() => setStep(1)} className="btn-secondary py-3 px-6">
              Back
            </button>
          ) : <div />}
          <button
            onClick={handleNext}
            disabled={currentSkills.length === 0}
            className="btn-primary py-3 px-8 flex items-center gap-2 disabled:opacity-50"
          >
            {step === 1 ? 'Next' : 'Finish Setup'} <HiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
