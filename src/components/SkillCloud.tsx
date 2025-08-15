"use client";

import React, { useState } from "react";

type RawSkill = string;

export default function SkillCloud({ skills }: { skills?: RawSkill[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!skills?.length) return null;

  // Kaç tanesi başta gözüksün?
  const visibleCount = 15;
  const visibleSkills = expanded ? skills : skills.slice(0, visibleCount);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {visibleSkills.map((s, index) => (
          <span
            key={index}
            className="rounded-full bg-white border border-gray-200 px-3 py-1 text-sm shadow-sm"
          >
            {s}
          </span>
        ))}

        {/* Nokta gösterimi */}
        {!expanded && skills.length > visibleCount && (
          <span className="px-2 text-gray-400">...</span>
        )}
      </div>

      {/* Buton */}
      {skills.length > visibleCount && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          {expanded ? "Daha Az Göster" : "Tümünü Göster"}
        </button>
      )}
    </div>
  );
}
