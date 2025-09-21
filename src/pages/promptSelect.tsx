"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getDeviceId } from "@/utils/simpleUtils";
import type { PlayerForSelection } from "convex/players";

type GameState = "category" | "prompt" | "gameplay";

export default function PromptSelectPage() {
  const [gameState, setGameState] = useState<GameState>("category");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  const markPromptsUsed = useMutation(api.game.markPromptsUsed);
  const increasePlayerScore = useMutation(api.game.increasePlayerScore);
  const changeDrawingPlayer = useMutation(api.game.changeDrawingPlayer);

  const localDeviceId = getDeviceId();

  const navigate = useNavigate();
  // grab parameters from URL
  const { gameId: gameIdString } = useParams<{ gameId: string }>();
  // change the type to Convex id, since it is stored as plaintext in the database
  const gameId = gameIdString ? (gameIdString as Id<"game">) : undefined;
  //const room = useQuery(api.rooms.getRoomForId, roomId ? { roomId } : "skip");
  const game = useQuery(api.game.getGame, gameId ? { gameId } : "skip");

  if (!game) return <p>Loading...</p>;

  const categories = useQuery(
    api.game.getDrawingThemes,
    gameId ? { gameId } : "skip"
  ) ?? {
    Simple: ["Loading"],
    Activities: ["Loading"],
  };

  const prompts = useQuery(
    api.game.getDrawingPromptsSimple,
    gameId && selectedCategory ? { gameId, selectedCategory } : "skip"
  );

  useEffect(() => {
    if (prompts && prompts.length > 0) {
      const ids = prompts.map((p) => p._id);
      markPromptsUsed({ promptIds: ids });
    }
  }, [prompts]);

  const promptsToDisplay = prompts?.map((p) => p.prompt) ?? ["Loading"];

  const playersData =
    useQuery(
      api.rooms.getPlayersInRoom,
      game.room_id ? { roomId: game.room_id as Id<"game_rooms"> } : "skip"
    ) ?? [];

  const playersToDisplay: PlayerForSelection[] = (playersData ?? [])
    .filter((p) => p._id !== game.currentlyDrawing) // omit current drawer
    .map((p) => ({
      _id: p._id,
      nickname: p.nickname,
      order: p.order ?? 0,
      isLocal: p.deviceId === localDeviceId,
    }));

  const maxOrder = Math.max(...playersToDisplay.map((p) => p.order));

  const drawingPlayer = playersData.find(
    (p) => p._id === game.currentlyDrawing
  );
  if (!drawingPlayer) return <p>Loading...</p>;
  if (!drawingPlayer.order) return <p>Loading...</p>;

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayer(playerId);
  };

  const handleContinue = () => {
    setGameState("prompt");
  };

  const handleConfirmPrompt = () => {
    setGameState("gameplay");
  };

  const handleConfirmPlayer = () => {
    console.log("Player confirmed:", selectedPlayer);
    if (!drawingPlayer) return;
    if (!drawingPlayer.order) return;
    // add points for guessed player
    increasePlayerScore({
      playerId: selectedPlayer as Id<"players">,
      increaseBy: 1,
    });
    // add points for drawing player
    increasePlayerScore({
      playerId: game.currentlyDrawing as Id<"players">,
      increaseBy: 1,
    });
    // change drawing player
    if (drawingPlayer.order ?? 0 < maxOrder) {
      const nextPlayer = playersData.find(
        (p) => p.order === (drawingPlayer?.order ?? 0) + 1 // problem here
      );
      if (nextPlayer) {
        changeDrawingPlayer({
          gameId: gameId as Id<"game">,
          playerId: nextPlayer?._id,
        });
      }
    } else if (drawingPlayer.order >= maxOrder) {
      const firstPlayer = playersData.find((p) => p.order === 1);
      if (firstPlayer) {
        changeDrawingPlayer({
          gameId: gameId as Id<"game">,
          playerId: firstPlayer?._id,
        });
      }
    }
    // redirect back to main game view
    navigate(`/game/${gameId}`);
  };

  const renderCategorySelection = () => (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Select Category
      </h1>

      {Object.entries(categories).map(([categoryType, items]) => (
        <div key={categoryType} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {categoryType}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <button
                key={item}
                onClick={() => handleCategorySelect(item)}
                className={`p-4 rounded-lg text-white font-semibold text-lg transition-all duration-200 ${
                  selectedCategory === item
                    ? "bg-orange-600 shadow-lg scale-105"
                    : "bg-orange-500 hover:bg-orange-600 shadow-md"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedCategory && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={handleContinue}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );

  const renderPromptSelection = () => (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Choose Your Prompt
      </h1>

      <div className="grid grid-cols-1 gap-4">
        {promptsToDisplay.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handlePromptSelect(prompt)}
            className={`p-8 rounded-lg text-white font-bold text-2xl transition-all duration-200 ${
              selectedPrompt === prompt
                ? "bg-orange-600 shadow-lg scale-105"
                : "bg-orange-500 hover:bg-orange-600 shadow-md"
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {selectedPrompt && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={handleConfirmPrompt}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold"
          >
            Confirm
          </Button>
        </div>
      )}
    </div>
  );

  const renderGameplay = () => (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Drawing Time!
      </h1>

      {/* Selected Prompt Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Your Prompt:
          </h2>
          <Button
            onClick={() => setIsPromptVisible(!isPromptVisible)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isPromptVisible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {isPromptVisible ? "Hide" : "Show"}
          </Button>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-500">
            {isPromptVisible ? selectedPrompt : "★".repeat(7)}
          </p>
        </div>
      </div>

      {/* Player Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Who guessed first?
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {playersToDisplay.map((player) => (
            <button
              key={player._id}
              onClick={() => handlePlayerSelect(player._id)}
              className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
                selectedPlayer === player._id
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
              }`}
            >
              {player.nickname}
              {player.isLocal && (
                <svg
                  className="w-4 h-4 inline ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v14H7V4zm2 15h6v1H9v-1z" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {selectedPlayer && (
          <Button
            onClick={handleConfirmPlayer}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold"
          >
            Confirm Player
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {gameState === "category" && renderCategorySelection()}
        {gameState === "prompt" && renderPromptSelection()}
        {gameState === "gameplay" && renderGameplay()}
      </div>
    </div>
  );
}
