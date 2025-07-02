"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shuffle, Plus, Play, Trophy, Users } from "lucide-react"

interface Player {
  id: string
  name: string
  score: number
  order: number
}

interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  theme: string
}

const themes = [
  {
    name: "História",
    color: "bg-gradient-to-br from-rose-500 to-pink-600",
    textColor: "text-rose-600",
    range: [0, 20],
  },
  {
    name: "Geografia",
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    textColor: "text-blue-600",
    range: [21, 40],
  },
  {
    name: "Ciências",
    color: "bg-gradient-to-br from-emerald-500 to-green-600",
    textColor: "text-emerald-600",
    range: [41, 60],
  },
  {
    name: "Esportes",
    color: "bg-gradient-to-br from-amber-500 to-orange-600",
    textColor: "text-amber-600",
    range: [61, 80],
  },
  {
    name: "Entretenimento",
    color: "bg-gradient-to-br from-purple-500 to-violet-600",
    textColor: "text-purple-600",
    range: [81, 100],
  },
]

const questions: Question[] = [
  {
    id: "1",
    question: "Em que ano foi proclamada a Independência do Brasil?",
    options: ["1820", "1822", "1824", "1825"],
    correct: 1,
    theme: "História",
  },
  {
    id: "2",
    question: "Qual é a capital da Austrália?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correct: 2,
    theme: "Geografia",
  },
  {
    id: "3",
    question: "Qual é o símbolo químico do ouro?",
    options: ["Go", "Au", "Or", "Ag"],
    correct: 1,
    theme: "Ciências",
  },
  {
    id: "4",
    question: "Quantos jogadores tem um time de futebol em campo?",
    options: ["10", "11", "12", "9"],
    correct: 1,
    theme: "Esportes",
  },
  {
    id: "5",
    question: "Quem dirigiu o filme 'Titanic'?",
    options: ["Steven Spielberg", "James Cameron", "Martin Scorsese", "Christopher Nolan"],
    correct: 1,
    theme: "Entretenimento",
  },
  {
    id: "6",
    question: "Quem foi o primeiro presidente do Brasil?",
    options: ["Getúlio Vargas", "Deodoro da Fonseca", "Floriano Peixoto", "Prudente de Morais"],
    correct: 1,
    theme: "História",
  },
  {
    id: "7",
    question: "Qual é o maior país do mundo?",
    options: ["China", "Canadá", "Estados Unidos", "Rússia"],
    correct: 3,
    theme: "Geografia",
  },
  {
    id: "8",
    question: "Qual planeta é conhecido como 'Planeta Vermelho'?",
    options: ["Vênus", "Marte", "Júpiter", "Saturno"],
    correct: 1,
    theme: "Ciências",
  },
]

export default function QuizGame() {
  const [gameState, setGameState] = useState<"setup" | "order" | "playing">("setup")
  const [players, setPlayers] = useState<Player[]>([])
  const [newPlayerName, setNewPlayerName] = useState("")
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [winner, setWinner] = useState<Player | null>(null)

  const resetGame = () => {
    setGameState("setup")
    setPlayers([])
    setNewPlayerName("")
    setCurrentPlayerIndex(0)
    setCurrentQuestion(null)
    setShowAnswer(false)
    setSelectedAnswer(null)
    setWinner(null)
  }

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        score: 0,
        order: 0,
      }
      setPlayers([...players, newPlayer])
      setNewPlayerName("")
    }
  }

  const shuffleOrder = () => {
    const shuffledPlayers = [...players]
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]]
    }

    const playersWithOrder = shuffledPlayers.map((player, index) => ({
      ...player,
      order: index + 1,
    }))

    setPlayers(playersWithOrder.sort((a, b) => a.order - b.order))
    setGameState("order")
  }

  const startGame = () => {
    setGameState("playing")
    setCurrentPlayerIndex(0)
  }

  const getPlayerTheme = (score: number) => {
    return themes.find((theme) => score >= theme.range[0] && score <= theme.range[1]) || themes[0]
  }

  const drawQuestion = () => {
    const currentPlayer = players[currentPlayerIndex]
    const playerTheme = getPlayerTheme(currentPlayer.score)
    const themeQuestions = questions.filter((q) => q.theme === playerTheme.name)

    if (themeQuestions.length > 0) {
      const randomQuestion = themeQuestions[Math.floor(Math.random() * themeQuestions.length)]
      setCurrentQuestion(randomQuestion)
      setShowAnswer(false)
      setSelectedAnswer(null)
    }
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowAnswer(true)

    if (currentQuestion && answerIndex === currentQuestion.correct) {
      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex].score += 10
      setPlayers(updatedPlayers)

      // Verificar vitória
      if (updatedPlayers[currentPlayerIndex].score >= 50) {
        setWinner(updatedPlayers[currentPlayerIndex])
      }
    }
  }

  const nextPlayer = () => {
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length)
    setCurrentQuestion(null)
    setShowAnswer(false)
    setSelectedAnswer(null)
  }

  if (gameState === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="shadow-2xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Trophy className="text-yellow-500 w-10 h-10" />
                Jogo de Perguntas
              </CardTitle>
              <p className="text-gray-600 mt-2">Cadastre os jogadores para começar</p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Nome do jogador"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                    className="rounded-2xl border-2 border-gray-200 focus:border-indigo-400 px-4 py-3 text-lg"
                  />
                  <Button
                    onClick={addPlayer}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl px-6 py-3"
                  >
                    <Plus size={20} />
                    Adicionar
                  </Button>
                </div>

                {players.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-700">
                      <Users size={20} />
                      Jogadores Cadastrados ({players.length})
                    </h3>
                    <div className="grid gap-3">
                      {players.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
                        >
                          <span className="text-lg font-medium text-gray-800">{player.name}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPlayers(players.filter((p) => p.id !== player.id))}
                            className="rounded-xl border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {players.length >= 2 && (
                  <Button
                    onClick={shuffleOrder}
                    className="w-full flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl py-4 text-lg font-semibold"
                  >
                    <Shuffle size={20} />
                    Sortear Ordem de Jogada
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState === "order") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="shadow-2xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Ordem de Jogada
              </CardTitle>
              <p className="text-gray-600 mt-2">Ordem sorteada para a partida</p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
                  >
                    <Badge
                      variant="secondary"
                      className="text-xl font-bold rounded-full px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700"
                    >
                      {player.order}º
                    </Badge>
                    <span className="text-xl font-medium text-gray-800">{player.name}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={startGame}
                className="w-full flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-2xl py-4 text-lg font-semibold"
              >
                <Play size={20} />
                Iniciar Jogo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (winner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                🎉 Parabéns! 🎉
              </h1>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">{winner.name} Venceu!</h2>
              <div className="text-6xl font-bold text-yellow-600 mb-2">{winner.score} pontos</div>
              <p className="text-gray-600 text-lg">Primeiro jogador a alcançar 50 pontos!</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Classificação Final:</h3>
              <div className="space-y-3">
                {[...players]
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-2xl ${
                        player.id === winner.id
                          ? "bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className="text-lg font-bold rounded-full px-3 py-1"
                        >
                          {index + 1}º
                        </Badge>
                        <span className="text-lg font-medium">{player.name}</span>
                      </div>
                      <span className="text-xl font-bold text-gray-700">{player.score} pts</span>
                    </div>
                  ))}
              </div>
            </div>

            <Button
              onClick={resetGame}
              size="lg"
              className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg"
            >
              Jogar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Botão de Reset */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 rounded-2xl px-6 py-2 font-semibold"
          >
            🔄 Resetar Jogo
          </Button>
        </div>

        {/* Escala de Pontuação */}
        <Card className="mb-8 shadow-xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Escala de Pontuação por Temática
            </CardTitle>
            <p className="text-center text-gray-600">Meta: 50 pontos para vencer!</p>
          </CardHeader>
          <CardContent>
            <div className="flex rounded-2xl overflow-hidden h-20 mb-4 shadow-lg">
              {themes.map((theme) => (
                <div
                  key={theme.name}
                  className={`${theme.color} flex-1 flex flex-col items-center justify-center text-white font-semibold`}
                >
                  <div className="text-sm font-bold">{theme.name}</div>
                  <div className="text-xs opacity-90">
                    {theme.range[0]}-{theme.range[1]} pts
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quadros dos Jogadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {players.map((player, index) => {
            const playerTheme = getPlayerTheme(player.score)
            const isCurrentPlayer = index === currentPlayerIndex

            return (
              <Card
                key={player.id}
                className={`${playerTheme.color} text-white shadow-xl rounded-3xl border-0 transform transition-all duration-300 ${
                  isCurrentPlayer ? "ring-4 ring-yellow-400 ring-opacity-75 scale-105" : "hover:scale-102"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{player.name}</h3>
                      <p className="text-sm opacity-90 mb-1">Posição: {player.order}º</p>
                      <p className="text-sm opacity-90">Tema: {playerTheme.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{player.score}</div>
                      <div className="text-sm opacity-90">pontos</div>
                      <div className="text-xs opacity-75">
                        {50 - player.score > 0 ? `${50 - player.score} para vencer` : "Vencedor!"}
                      </div>
                    </div>
                  </div>
                  {isCurrentPlayer && (
                    <Badge className="mt-3 bg-yellow-400 text-black font-bold rounded-full px-3 py-1">
                      ⭐ Sua vez!
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Área da Pergunta */}
        <Card className="shadow-xl rounded-3xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              Vez de:{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {players[currentPlayerIndex]?.name}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {!currentQuestion ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <Badge
                    className={`${getPlayerTheme(players[currentPlayerIndex]?.score || 0).color} text-white text-lg px-4 py-2 rounded-2xl`}
                  >
                    📚 {getPlayerTheme(players[currentPlayerIndex]?.score || 0).name}
                  </Badge>
                </div>
                <p className="mb-6 text-xl text-gray-700">
                  Tema atual: <strong>{getPlayerTheme(players[currentPlayerIndex]?.score || 0).name}</strong>
                </p>
                <Button
                  onClick={drawQuestion}
                  size="lg"
                  className="flex items-center gap-3 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Shuffle size={24} />
                  Sortear Pergunta
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge
                    className={`${getPlayerTheme(players[currentPlayerIndex]?.score || 0).color} text-white text-lg px-4 py-2 rounded-2xl`}
                  >
                    📚 {currentQuestion.theme}
                  </Badge>
                </div>

                <h3 className="text-2xl font-semibold text-center mb-8 text-gray-800 leading-relaxed">
                  {currentQuestion.question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={
                        showAnswer
                          ? index === currentQuestion.correct
                            ? "default"
                            : selectedAnswer === index
                              ? "destructive"
                              : "outline"
                          : "outline"
                      }
                      className={`p-6 h-auto text-left justify-start rounded-2xl border-2 text-lg font-medium transition-all duration-300 ${
                        showAnswer && index === currentQuestion.correct
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-green-400"
                          : showAnswer && selectedAnswer === index
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-400"
                            : "hover:bg-gray-50 hover:border-indigo-300"
                      }`}
                      onClick={() => !showAnswer && selectAnswer(index)}
                      disabled={showAnswer}
                    >
                      <span className="font-bold mr-3 text-xl">{String.fromCharCode(65 + index)})</span>
                      {option}
                    </Button>
                  ))}
                </div>

                {showAnswer && (
                  <div className="text-center space-y-6 pt-4">
                    <div
                      className={`p-6 rounded-2xl text-lg font-semibold ${
                        selectedAnswer === currentQuestion.correct
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300"
                          : "bg-gradient-to-r from-red-100 to-red-100 text-red-800 border-2 border-red-300"
                      }`}
                    >
                      {selectedAnswer === currentQuestion.correct
                        ? "🎉 Resposta correta! +10 pontos"
                        : "❌ Resposta incorreta. A resposta certa era: " +
                          currentQuestion.options[currentQuestion.correct]}
                    </div>
                    <Button
                      onClick={nextPlayer}
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl px-8 py-3 text-lg font-semibold"
                    >
                      Próximo Jogador →
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
