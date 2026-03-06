"use client";
import React, { ReactNode } from "react";

interface ResumeProps {
  children: ReactNode;
}

const Resume: React.FC<ResumeProps> = ({ children }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-page pt-10 bg-gray-100 print:bg-white pb-30">
      <div className="resume-container mx-auto w-3xl overflow-auto bg-white shadow-xl border border-gray-300 p-10 print:shadow-none print:border-none print:p-0">
        <div>{children}</div>
        <div className="hidden-from-print fixed bottom-0 left-0 w-full bg-blue-950">
          <div className="flex justify-center items-center gap-5 text-white h-15 px-3">
            <div>Bos Eriko Reyes’ Resume — ready to download.</div>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
              onClick={handlePrint}
            >
              Download
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body {
            margin: 10mm;
            background: white !important;
          }
          .hidden-from-print {
            display: none !important;
          }
          .resume-container {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Resume;
