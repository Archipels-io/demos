"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, Shield, Zap } from "lucide-react";

export default function VerificationPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0142ff] to-[#8907ff] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Content */}
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
          Identity Verification Required
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/80 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Please verify your identity to access this content.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="flex flex-col items-center text-center">
              <Lock className="w-12 h-12 mb-4 text-white/90" />
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-white/80">
                We won&apos;t have access to your personal documents
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="flex flex-col items-center text-center">
              <Shield className="w-12 h-12 mb-4 text-white/90" />
              <h3 className="text-xl font-semibold mb-2">Secure Verification</h3>
              <p className="text-white/80">
                Your data is encrypted and stored only in your wallet
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <div className="flex flex-col items-center text-center">
              <Zap className="w-12 h-12 mb-4 text-white/90" />
              <h3 className="text-xl font-semibold mb-2">Quick Process</h3>
              <p className="text-white/80">
                Verify your identity in minutes, reuse your credentials in seconds
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="flex gap-4 justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Button
            variant="secondary"
            className="bg-white text-[#0142ff] hover:bg-white/90 text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_ARCHIPELS_APP_URL}/presentation-requests/initialize?message=/verify-identity&invitation=${process.env.NEXT_PUBLIC_INVITATION_LINK}&onboarding=quick`,
              )}
          >
            Verify
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
            onClick={() => window.open("https://archipels.io", "_blank")}
          >
            Learn More
          </Button>
        </motion.div>
      </motion.div>

      {/* Animated logo in bottom left */}
      <motion.div
        className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden"
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

      {/* GitHub FAB */}
      <motion.a
        href="https://github.com/Archipels-io/demos/tree/main/identity-check"
        className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all duration-200 z-50"
        title="Check out the source code"
        target="_blank"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
          alt="GitHub"
          width={24}
          height={24}
        />
      </motion.a>
    </div>
  );
}
