"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, MessageSquare, Hand, Info, ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

const themesByType = {
  drawing: {
    Simple: [
      {
        id: "animals",
        name: "Animals",
        description: "Draw various animals like dogs, cats, elephants, etc.",
      },
      {
        id: "food",
        name: "Food",
        description: "Draw different types of food and dishes",
      },
      {
        id: "objects",
        name: "Objects",
        description: "Draw everyday objects and items",
      },
      {
        id: "nature",
        name: "Nature",
        description: "Draw natural elements like trees, flowers, mountains",
      },
      {
        id: "vehicles",
        name: "Vehicles",
        description: "Draw cars, bikes, planes, and other vehicles",
      },
      {
        id: "buildings",
        name: "Buildings",
        description: "Draw houses, castles, and structures",
      },
      {
        id: "clothing",
        name: "Clothing",
        description: "Draw different types of clothes and accessories",
      },
      { id: "tools", name: "Tools", description: "Draw tools and equipment" },
      {
        id: "toys",
        name: "Toys",
        description: "Draw children's toys and games",
      },
    ],
    Activities: [
      {
        id: "sports",
        name: "Sports",
        description: "Draw sports activities and equipment",
      },
      {
        id: "hobbies",
        name: "Hobbies",
        description: "Draw hobby-related items and scenes",
      },
      {
        id: "travel",
        name: "Travel",
        description: "Draw travel destinations and landmarks",
      },
      {
        id: "cooking",
        name: "Cooking",
        description: "Draw cooking activities and kitchen scenes",
      },
      {
        id: "music",
        name: "Music",
        description: "Draw musical instruments and performances",
      },
      {
        id: "art",
        name: "Art",
        description: "Draw artistic activities and tools",
      },
      {
        id: "gardening",
        name: "Gardening",
        description: "Draw gardening activities and plants",
      },
      {
        id: "reading",
        name: "Reading",
        description: "Draw reading-related scenes and items",
      },
      {
        id: "gaming",
        name: "Gaming",
        description: "Draw gaming activities and equipment",
      },
    ],
  },
  speaking: {
    Simple: [
      {
        id: "movies",
        name: "Movies",
        description: "Describe famous movies and scenes",
      },
      {
        id: "books",
        name: "Books",
        description: "Describe popular books and stories",
      },
      {
        id: "celebrities",
        name: "Celebrities",
        description: "Describe famous people",
      },
      {
        id: "brands",
        name: "Brands",
        description: "Describe well-known brands and products",
      },
      {
        id: "songs",
        name: "Songs",
        description: "Describe popular songs and music",
      },
      {
        id: "tv-shows",
        name: "TV Shows",
        description: "Describe television series and episodes",
      },
      {
        id: "games",
        name: "Games",
        description: "Describe video games and board games",
      },
      {
        id: "apps",
        name: "Apps",
        description: "Describe popular applications and software",
      },
      {
        id: "inventions",
        name: "Inventions",
        description: "Describe important inventions and innovations",
      },
    ],
    Activities: [
      {
        id: "events",
        name: "Events",
        description: "Describe historical or cultural events",
      },
      {
        id: "professions",
        name: "Professions",
        description: "Describe different jobs and careers",
      },
      {
        id: "places",
        name: "Places",
        description: "Describe locations and destinations",
      },
      {
        id: "traditions",
        name: "Traditions",
        description: "Describe cultural traditions and customs",
      },
      {
        id: "festivals",
        name: "Festivals",
        description: "Describe celebrations and festivals",
      },
      {
        id: "ceremonies",
        name: "Ceremonies",
        description: "Describe ceremonial events and rituals",
      },
      {
        id: "competitions",
        name: "Competitions",
        description: "Describe competitive events and contests",
      },
      {
        id: "performances",
        name: "Performances",
        description: "Describe theatrical and artistic performances",
      },
      {
        id: "meetings",
        name: "Meetings",
        description: "Describe social gatherings and meetings",
      },
    ],
  },
  pantomime: {
    Simple: [
      {
        id: "actions",
        name: "Actions",
        description: "Act out simple actions and movements",
      },
      {
        id: "emotions",
        name: "Emotions",
        description: "Express different emotions and feelings",
      },
      {
        id: "characters",
        name: "Characters",
        description: "Act as different character types",
      },
      {
        id: "gestures",
        name: "Gestures",
        description: "Perform common gestures and signals",
      },
      {
        id: "expressions",
        name: "Expressions",
        description: "Show facial expressions and reactions",
      },
      {
        id: "movements",
        name: "Movements",
        description: "Demonstrate different types of movement",
      },
      {
        id: "poses",
        name: "Poses",
        description: "Strike different poses and stances",
      },
      {
        id: "interactions",
        name: "Interactions",
        description: "Show interactions with objects",
      },
      {
        id: "reactions",
        name: "Reactions",
        description: "React to imaginary situations",
      },
    ],
    Activities: [
      {
        id: "situations",
        name: "Situations",
        description: "Act out various scenarios",
      },
      {
        id: "occupations",
        name: "Occupations",
        description: "Mime different job activities",
      },
      {
        id: "stories",
        name: "Stories",
        description: "Act out story sequences",
      },
      {
        id: "routines",
        name: "Routines",
        description: "Perform daily routine activities",
      },
      {
        id: "adventures",
        name: "Adventures",
        description: "Act out adventure scenarios",
      },
      {
        id: "challenges",
        name: "Challenges",
        description: "Show challenging situations",
      },
      {
        id: "conflicts",
        name: "Conflicts",
        description: "Demonstrate conflict scenarios",
      },
      {
        id: "solutions",
        name: "Solutions",
        description: "Show problem-solving actions",
      },
      {
        id: "sequences",
        name: "Sequences",
        description: "Perform action sequences",
      },
    ],
  },
};

const countOptions = [1, 2, 5, 10, 20];

interface GeneratedIdea {
  theme: string;
  prompt: string;
}

export default function GeneratorPage() {
  const [promptType, setPromptType] = useState<
    "drawing" | "speaking" | "pantomime" | ""
  >("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [themeMode, setThemeMode] = useState<"predefined" | "custom">(
    "predefined"
  );
  const [customThemeName, setCustomThemeName] = useState("");
  const [customThemeDescription, setCustomThemeDescription] = useState("");
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);

  const navigate = useNavigate();

  const handlePromptTypeSelect = (
    type: "drawing" | "speaking" | "pantomime"
  ) => {
    setPromptType(type);
    setSelectedThemes([]);
    setCustomThemeName("");
    setCustomThemeDescription("");
  };

  const handleThemeToggle = (themeId: string) => {
    setSelectedThemes((prev) =>
      prev.includes(themeId)
        ? prev.filter((id) => id !== themeId)
        : [...prev, themeId]
    );
  };

  const handleThemeModeToggle = (mode: "predefined" | "custom") => {
    setThemeMode(mode);
    setSelectedThemes([]);
    setCustomThemeName("");
    setCustomThemeDescription("");
  };

  const isGenerateEnabled =
    promptType !== "" &&
    ((themeMode === "predefined" && selectedThemes.length > 0) ||
      (themeMode === "custom" &&
        customThemeName.trim() !== "" &&
        customThemeDescription.trim() !== "")) &&
    selectedCount !== null;

  const handleGenerate = () => {
    console.log("Generating ideas:", {
      promptType,
      themeMode,
      themes:
        themeMode === "predefined"
          ? selectedThemes
          : { name: customThemeName, description: customThemeDescription },
      count: selectedCount,
    });
    const mockIdeas: GeneratedIdea[] = Array.from(
      { length: selectedCount || 0 },
      (_, i) => ({
        theme: themeMode === "predefined" ? `Theme ${i + 1}` : customThemeName,
        prompt: `Sample prompt idea ${i + 1}`,
      })
    );
    setGeneratedIdeas(mockIdeas);
  };

  const renderPromptTypeIcon = (type: "drawing" | "speaking" | "pantomime") => {
    switch (type) {
      case "drawing":
        return <Pencil className="w-6 h-6" />;
      case "speaking":
        return <MessageSquare className="w-6 h-6" />;
      case "pantomime":
        return <Hand className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home Page
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
            Generate Prompt Ideas
          </h1>
          <div className="w-[200px]"></div> {/* Spacer for balance */}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch max-w-7xl mx-auto">
          {/* Section 1: Prompt Type */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md flex-1 min-h-[400px] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Type of Prompt
            </h2>
            <div className="flex-1 flex flex-col gap-3">
              {(["drawing", "speaking", "pantomime"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handlePromptTypeSelect(type)}
                  className={`flex-1 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                    promptType === type
                      ? "bg-white text-black border-2 border-black shadow-lg"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  {renderPromptTypeIcon(type)}
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Theme Selection */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md flex-1 min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Theme</h2>
              {promptType && (
                <div className="flex justify-center mb-4">
                  <div className="inline-flex rounded-lg border-2 border-gray-400 overflow-hidden">
                    <button
                      onClick={() => handleThemeModeToggle("predefined")}
                      className={`px-6 py-2 font-medium transition-all duration-200 ${
                        themeMode === "predefined"
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Selection
                    </button>
                    <button
                      onClick={() => handleThemeModeToggle("custom")}
                      className={`px-6 py-2 font-medium transition-all duration-200 border-l-2 border-gray-400 ${
                        themeMode === "custom"
                          ? "bg-gray-700 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!promptType ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a prompt type first
              </div>
            ) : themeMode === "predefined" ? (
              <div className="flex-1 overflow-y-auto space-y-4">
                <TooltipProvider>
                  {Object.entries(themesByType[promptType]).map(
                    ([category, themes]) => (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                          {category}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {themes.map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => handleThemeToggle(theme.id)}
                              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
                                selectedThemes.includes(theme.id)
                                  ? "bg-white text-black border-2 border-black"
                                  : "bg-gray-600 text-white hover:bg-gray-700"
                              }`}
                            >
                              <span className="truncate">{theme.name}</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-3 h-3 flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    {theme.description}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </TooltipProvider>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="theme-name" className="text-gray-800">
                      Theme Name
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Enter a short, descriptive name for your custom
                            theme
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="theme-name"
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                    placeholder="e.g., Fantasy Creatures"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="theme-description"
                      className="text-gray-800"
                    >
                      Description
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Describe what types of prompts should be generated
                            for this theme
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="theme-description"
                    value={customThemeDescription}
                    onChange={(e) => setCustomThemeDescription(e.target.value)}
                    placeholder="e.g., Mythical beings and magical creatures"
                    className="bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Number of Ideas */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-md flex-1 min-h-[400px] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Number of Ideas
            </h2>
            <div className="flex-1 flex flex-col gap-3">
              {countOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedCount(count)}
                  className={`flex-1 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    selectedCount === count
                      ? "bg-white text-black border-2 border-black shadow-lg"
                      : "bg-gray-600 text-white hover:bg-gray-700"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleGenerate}
            disabled={!isGenerateEnabled}
            className={`px-12 py-6 text-lg font-bold transition-all duration-200 ${
              isGenerateEnabled
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            Generate Ideas
          </Button>
        </div>

        <div className="mt-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Theme
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Prompt Idea
                  </th>
                </tr>
              </thead>
              <tbody>
                {generatedIdeas.length === 0
                  ? // Empty state with 3 inactive rows
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 opacity-40"
                      >
                        <td className="px-6 py-4 text-gray-400">-</td>
                        <td className="px-6 py-4 text-gray-400">-</td>
                      </tr>
                    ))
                  : // Generated ideas
                    generatedIdeas.map((idea, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-gray-800">
                          {idea.theme}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {idea.prompt}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
