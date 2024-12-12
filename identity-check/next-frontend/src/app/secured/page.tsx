"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SecuredContent() {
  const searchParams = useSearchParams();
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0ab86f] to-[#07ff8c] flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Identity Verified Successfully
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/80 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Welcome, {firstName} {lastName}!
        </motion.p>
      </motion.div>

      {/* Animated logo */}
      <motion.div
        className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden"
        animate={{
          y: [0, -20, 0],
          rotate: -360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Image
          src="https://connect-prod.s3.fr-par.scw.cloud/logo/archipels-logotype.png"
          alt="Archipels Logo"
          width={100}
          height={100}
          className="object-contain"
        />
      </motion.div>
    </div>
  );
}

export default function SecuredPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SecuredContent />
    </Suspense>
  );
} 