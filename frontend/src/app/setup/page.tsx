'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { api } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

export default function Setup() {
  const router = useRouter();
  const [jobDesc, setJobDesc] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeText(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleCompile = async () => {
    if (!jobDesc || !resumeText) {
      setError('Both Target Mandate (Job Description) and Candidate Profile (Resume) are required.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await api.createSession({
        job_description: jobDesc,
        resume_text: resumeText
      });
      
      if (response.id) {
        router.push(`/interview?session=${response.id}`);
      } else {
        throw new Error('Failed to create session');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while compiling the briefcase.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto px-margin-mobile md:px-gutter py-8 md:py-margin-desktop">
          <div className="max-w-container-max mx-auto h-full flex flex-col">
            <header className="mb-12">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Initialize Briefcase</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Construct the strategic foundation for your upcoming session by providing the operational context and candidate profile.</p>
              {error && <p className="mt-4 text-error font-body-md">{error}</p>}
            </header>
            
            {/* Split View Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-1">
              {/* Left Column: The Pad (Job Description) */}
              <div className="relative bg-tertiary-fixed rounded-xl p-8 pt-12 embossed-card border border-outline-variant/20 flex flex-col">
                {/* Metal Clip Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-inverse-surface rounded-b-lg shadow-md flex items-end justify-center pb-1">
                  <div className="w-20 h-1 bg-outline rounded-full opacity-50"></div>
                </div>
                
                <div className="flex items-center space-x-3 mb-6">
                  <span className="material-symbols-outlined text-secondary">description</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Target Mandate</h3>
                </div>
                
                <div className="flex-1 flex flex-col relative">
                  <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 ml-1" htmlFor="job-desc">Paste Job Description</label>
                  {/* Debossed Input Area */}
                  <textarea 
                    className="flex-1 w-full bg-surface-container-lowest debossed-well rounded-lg p-6 font-data-mono text-data-mono text-on-surface focus:ring-2 focus:ring-secondary/40 outline-none resize-none border-none leading-relaxed" 
                    id="job-desc" 
                    placeholder="Enter the complete operational requirements and responsibilities..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                  {/* Hand-drawn style decorative lines (CSS only) */}
                  <div className="absolute top-10 left-6 bottom-6 w-[2px] bg-secondary/10 pointer-events-none"></div>
                </div>
              </div>
              
              {/* Right Column: The File (Resume) */}
              <div className="relative bg-surface rounded-xl p-8 stacked-file border-t-8 border-t-primary-container flex flex-col embossed-card">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="material-symbols-outlined text-primary">contact_page</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Candidate Profile</h3>
                </div>
                
                {/* Debossed Upload Well */}
                <div className="border-2 border-dashed border-outline-variant bg-surface-container-low rounded-xl flex-1 flex flex-col items-center justify-center p-8 debossed-well hover:bg-surface-container transition-colors group relative overflow-hidden">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    accept=".txt,.pdf,.docx" 
                    onChange={handleFileUpload}
                    disabled={isSubmitting}
                  />
                  <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-3xl">upload_file</span>
                  </div>
                  <h4 className="font-body-lg text-body-lg font-medium text-on-surface mb-1">Upload Dossier Data</h4>
                  <p className="font-data-mono text-data-mono text-on-surface-variant text-center max-w-xs">
                    {resumeText ? 'Document loaded successfully.' : 'Drag and drop PDF, DOCX, or raw text file.'}
                  </p>
                  {/* File Upload UI */}
                </div>
                
                <div className="mt-8 pt-6 border-t border-dashed border-outline-variant/50">
                  {/* Mechanical Action Button */}
                  <button 
                    onClick={handleCompile}
                    disabled={isSubmitting || !jobDesc || !resumeText}
                    className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-5 px-6 rounded-lg uppercase tracking-widest mechanical-btn flex items-center justify-between transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Compiling...' : 'Compile Briefcase'}</span>
                    <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </AuthGuard>
  );
}
