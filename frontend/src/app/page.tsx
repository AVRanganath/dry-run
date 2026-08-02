'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navRoute = isAuthenticated ? '/dashboard' : '/login';
  const navLabel = isAuthenticated ? 'View Dossier' : 'Access Terminal';
  
  const heroRoute = isAuthenticated ? '/setup' : '/login';
  const heroLabel = 'Initiate Simulation';

  return (
    <div className="min-h-screen bg-texture bg-background text-on-surface flex flex-col font-body-md relative selection:bg-primary selection:text-on-primary overflow-x-hidden">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full px-gutter py-6 border-b border-outline-variant/30 relative z-10 flex justify-between items-center bg-surface/60 backdrop-blur-xl"
      >
        <div className="flex items-center space-x-3">
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">Dry Run</h1>
        </div>
        <div className="flex space-x-4 items-center">
          <Link href={navRoute} className="bg-primary text-on-primary font-label-caps text-label-caps py-2 px-6 rounded-lg uppercase tracking-widest mechanical-btn hover:translate-y-[1px] transition-transform">
            {navLabel}
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col w-full">
        <section className="w-full px-gutter py-20 md:py-32 max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-16">
          <motion.div 
            className="flex-1 space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              variants={fadeUp}
              className="font-headline-xl text-6xl md:text-8xl leading-[1.1] tracking-tight bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent"
            >
              Master the Interrogation.
            </motion.h2>
            <motion.h2 
              variants={fadeUp}
              className="font-headline-xl text-5xl md:text-6xl text-on-surface-variant opacity-80"
            >
              Secure the Position.
            </motion.h2>
            
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent rounded-full"></div>
              <p className="font-body-lg text-xl text-on-surface-variant max-w-2xl pl-6 py-2">
                Dry Run is an advanced AI-powered simulation terminal. Upload your target dossier, select a job profile, and undergo a rigorous, dynamic interrogation designed to expose weaknesses before the real interview.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href={heroRoute} className="bg-primary text-on-primary font-label-caps text-label-caps py-4 px-8 rounded-lg uppercase tracking-widest flex items-center justify-center space-x-3 mechanical-btn hover:translate-y-[1px] transition-transform w-fit group">
                <span className="material-symbols-outlined group-hover:animate-pulse">terminal</span>
                <span>{heroLabel}</span>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Visual Element (Floating Card) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="flex-1 w-full max-w-lg relative perspective-1000"
          >
            <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            
            <motion.div 
              whileHover={{ rotate: 0, scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-surface border-2 border-outline-variant/50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm"
            >
              <div className="border-b-2 border-primary/30 pb-4 mb-6 flex justify-between items-start relative">
                <div>
                  <div className="font-data-mono text-[10px] text-primary/70 uppercase tracking-widest mb-1 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                    <span>Live Analysis</span>
                  </div>
                  <div className="font-headline-md text-primary text-2xl tracking-tight">EVALUATION REPORT</div>
                </div>
                <motion.div 
                  initial={{ scale: 3, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: -15 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  className="stamp-effect px-4 py-1 border-2 border-error text-error absolute -top-4 -right-4"
                >
                  <span className="font-data-mono font-bold text-sm tracking-widest">PASSED</span>
                </motion.div>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                   <div className="h-3 bg-surface-variant rounded-full w-full overflow-hidden relative">
                     <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }} className="absolute inset-0 bg-primary/20"></motion.div>
                   </div>
                   <div className="h-3 bg-surface-variant rounded-full w-4/5 overflow-hidden relative">
                     <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }} className="absolute inset-0 bg-primary/20"></motion.div>
                   </div>
                </div>
                
                <div className="mt-8 border-t border-dashed border-outline-variant/50 pt-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-label-caps text-primary text-sm tracking-widest">Clarity of Thought</span>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                      className="font-data-mono text-lg font-bold text-primary"
                    >
                      9.2/10
                    </motion.span>
                  </div>
                  
                  {/* Analog Block Metric Bar */}
                  <div className="w-full h-8 bg-surface-container-high rounded-sm shadow-debossed p-1 flex space-x-[2px]">
                    {[...Array(9)].map((_, i) => (
                      <motion.div 
                        key={`full-${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.2 }}
                        className="h-full flex-1 bg-surface-tint shadow-embossed rounded-[1px]"
                      ></motion.div>
                    ))}
                    <div className="h-full flex-1 bg-surface-variant rounded-[1px]"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="w-full px-gutter py-32 bg-surface-container-low border-y border-outline-variant/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-texture opacity-50 mix-blend-overlay"></div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-container-max mx-auto relative z-10"
          >
            <div className="text-center mb-20">
              <motion.h3 variants={fadeUp} className="font-headline-lg text-5xl text-primary mb-6 tracking-tight">Tactical Advantages</motion.h3>
              <motion.p variants={fadeUp} className="font-body-lg text-on-surface-variant max-w-2xl mx-auto text-lg">
                Equip yourself with the tools required to navigate the most hostile interview environments.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                variants={fadeUp}
                className="bg-surface p-8 rounded-lg embossed-card flex flex-col relative overflow-hidden group"
              >
                {/* Decorative screws */}
                <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                
                <div className="w-16 h-16 bg-surface-container-low rounded-lg flex items-center justify-center mb-6 relative z-10 shadow-debossed">
                  <span className="material-symbols-outlined text-4xl text-primary">quick_reference_all</span>
                </div>
                <h4 className="font-headline-md text-2xl text-primary mb-4 relative z-10">Dossier Analysis</h4>
                <p className="font-body-md text-on-surface-variant leading-relaxed relative z-10">
                  Upload your resume and the target job description. Our systems extract key variables to formulate a highly targeted interrogation matrix tailored specifically to your profile.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                variants={fadeUp}
                className="bg-surface p-8 rounded-lg embossed-card flex flex-col relative overflow-hidden group"
              >
                <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                
                <div className="w-16 h-16 bg-surface-container-low rounded-lg flex items-center justify-center mb-6 relative z-10 shadow-debossed">
                  <span className="material-symbols-outlined text-4xl text-secondary">record_voice_over</span>
                </div>
                <h4 className="font-headline-md text-2xl text-secondary mb-4 relative z-10">Dynamic Simulation</h4>
                <p className="font-body-md text-on-surface-variant leading-relaxed relative z-10">
                  Face an adaptive AI interrogator. Questions pivot instantly based on your provided history and the specific requirements of the operation, ensuring no two sessions are identical.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                variants={fadeUp}
                className="bg-surface p-8 rounded-lg embossed-card flex flex-col relative overflow-hidden group"
              >
                <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-outline-variant/50 shadow-inner"></div>
                
                <div className="w-16 h-16 bg-surface-container-low rounded-lg flex items-center justify-center mb-6 relative z-10 shadow-debossed">
                  <span className="material-symbols-outlined text-4xl text-error">analytics</span>
                </div>
                <h4 className="font-headline-md text-2xl text-error mb-4 relative z-10">Actionable Intelligence</h4>
                <p className="font-body-md text-on-surface-variant leading-relaxed relative z-10">
                  Receive a highly classified debriefing after each session. Review calculated metrics, observed strengths, and critical areas for refinement before you face the real interview.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 px-gutter bg-surface">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="font-data-mono text-[12px] text-on-surface-variant opacity-60">
              © {new Date().getFullYear()} A V Ranganath.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
