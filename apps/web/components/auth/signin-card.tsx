'use client'
import React from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export function SignInCard() {


  // For 3D card effect - increased rotation range for more pronounced 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]); // Increased from 5/-5 to 10/-10
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]); // Increased from -5/5 to -10/10

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-sm relative z-10"
      style={{ perspective: 1500 }}
    >
      <motion.div
        className="relative"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ z: 10 }}
      >
        <div className="relative group">
          {/* Card glow effect - reduced intensity */}
          <motion.div
            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
            animate={{
              boxShadow: [
                "0 0 10px 2px rgba(255,255,255,0.03)",
                "0 0 15px 5px rgba(255,255,255,0.05)",
                "0 0 10px 2px rgba(255,255,255,0.03)"
              ],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror"
            }}
          />

          {/* Traveling light beam effect - reduced opacity */}
          <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
            {/* Top light beam - enhanced glow */}
            <motion.div
              className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{
                left: ["-50%", "100%"],
                opacity: [0.3, 0.7, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                left: {
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1
                },
                opacity: {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror"
                },
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              }}
            />

            {/* Right light beam - enhanced glow */}
            <motion.div
              className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{
                top: ["-50%", "100%"],
                opacity: [0.3, 0.7, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                top: {
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 0.6
                },
                opacity: {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 0.6
                },
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 0.6
                }
              }}
            />

            {/* Bottom light beam - enhanced glow */}
            <motion.div
              className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{
                right: ["-50%", "100%"],
                opacity: [0.3, 0.7, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                right: {
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 1.2
                },
                opacity: {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 1.2
                },
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 1.2
                }
              }}
            />

            {/* Left light beam - enhanced glow */}
            <motion.div
              className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{
                bottom: ["-50%", "100%"],
                opacity: [0.3, 0.7, 0.3],
                filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
              }}
              transition={{
                bottom: {
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 1.8
                },
                opacity: {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 1.8
                },
                filter: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 1.8
                }
              }}
            />

            {/* Subtle corner glow spots - reduced opacity */}
            <motion.div
              className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
              animate={{
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
            <motion.div
              className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
              animate={{
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-white/60 blur-[2px]"
              animate={{
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 h-[5px] w-[5px] rounded-full bg-white/40 blur-[1px]"
              animate={{
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 2.3,
                repeat: Infinity,
                repeatType: "mirror",
                delay: 1.5
              }}
            />
          </div>

          {/* Card border glow - reduced opacity */}
          <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/3 via-white/7 to-white/3 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

          {/* Glass card background */}
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
            {/* Subtle card inner patterns */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                backgroundSize: '30px 30px'
              }}
            />

            <div className="text-center space-y-1 mb-7">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
              >
                Model with Orca
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-xs"
              >
                Sign in with your Git provider
              </motion.p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full relative group/github"
                onClick={() => signIn('github', { callbackUrl: '/chat' })}
              >
                <div className="absolute inset-0 bg-white/5 rounded-lg blur opacity-0 group-hover/github:opacity-70 transition-opacity duration-300" />

                <div className="relative overflow-hidden bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>

                  <span className="text-white/80 group-hover/github:text-white transition-colors text-xs">
                    Sign in with GitHub
                  </span>

                  {/* Button hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{
                      duration: 1,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.button>

              <div className="flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="mx-3 text-xs text-white/40">or continue with</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Secondary OAuth buttons */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full relative group/bitbucket"
                onClick={() => signIn('bitbucket', { callbackUrl: '/chat' })}
              >
                <div className="absolute inset-0 bg-white/5 rounded-lg blur opacity-0 group-hover/bitbucket:opacity-70 transition-opacity duration-300" />
                <div className="relative overflow-hidden bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0052CC">
                    <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.704z" />
                  </svg>
                  <span className="text-white/80 group-hover/bitbucket:text-white transition-colors text-xs">Sign in with Bitbucket</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full relative group/gitlab"
                onClick={() => signIn('gitlab', { callbackUrl: '/chat' })}
              >
                <div className="absolute inset-0 bg-white/5 rounded-lg blur opacity-0 group-hover/gitlab:opacity-70 transition-opacity duration-300" />
                <div className="relative overflow-hidden bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#FC6D26">
                    <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.135-.423-.73-.423-.867 0L1.388 9.452-.955 13.587a.849.849 0 00.308 1.005L12 23.054l10.647-8.462a.849.849 0 00.308-1.005" />
                  </svg>
                  <span className="text-white/80 group-hover/gitlab:text-white transition-colors text-xs">Sign in with GitLab</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full relative group/huggingface"
                onClick={() => signIn('huggingface', { callbackUrl: '/chat' })}
              >
                <div className="absolute inset-0 bg-white/5 rounded-lg blur opacity-0 group-hover/huggingface:opacity-70 transition-opacity duration-300" />
                <div className="relative overflow-hidden bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                  <span className="text-md">🤗</span>
                  <span className="text-white/80 group-hover/huggingface:text-white transition-colors text-xs">Sign in with HuggingFace</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </motion.button>
            </div>

            {/* Sign up link */}
            <motion.p
              className="text-center text-xs text-white/60 mt-4 flex flex-col gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>
                <Link href="/terms" className="underline hover:text-white/80 transition-colors duration-200">Terms and Conditions</Link>
                <span className="mx-2">·</span>
                <Link href="/privacy" className="underline hover:text-white/80 transition-colors duration-200">Privacy Policy</Link>
              </span>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
