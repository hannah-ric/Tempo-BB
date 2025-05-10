import React, { useState } from "react";
import { Send, Loader2, PlusCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface SuggestedPrompt {
  id: string;
  text: string;
  category: "material" | "dimension" | "joinery" | "style";
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => void;
  isProcessing?: boolean;
  messages?: Message[];
  suggestedPrompts?: SuggestedPrompt[];
}

const ChatInterface = ({
  onSendMessage = () => {},
  isProcessing = false,
  messages = [
    {
      id: "1",
      content:
        "Welcome to the AI Furniture Design Generator! Describe the furniture piece you want to create.",
      sender: "ai",
      timestamp: new Date(),
    },
  ],
  suggestedPrompts = [
    { id: "1", text: "Change material to walnut", category: "material" },
    { id: "2", text: "Make the table taller", category: "dimension" },
    { id: "3", text: "Use dovetail joints for drawers", category: "joinery" },
    { id: "4", text: "Make it mid-century modern style", category: "style" },
  ],
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() && !isProcessing) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <Card className="flex flex-col h-full w-full bg-background border rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Design Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Describe your furniture and refine the design
        </p>
      </div>

      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-8 w-8">
                  {message.sender === "ai" ? (
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai" />
                  ) : (
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                  )}
                  <AvatarFallback>
                    {message.sender === "ai" ? "AI" : "You"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 block mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=ai" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p className="text-sm">Generating design...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestedPrompts.map((prompt) => (
            <Badge
              key={prompt.id}
              variant="outline"
              className="cursor-pointer hover:bg-accent"
              onClick={() => handleSuggestedPrompt(prompt.text)}
            >
              {prompt.text}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => onSendMessage("Start a new design")}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
          <div className="flex-grow relative">
            <Input
              placeholder="Describe your furniture design..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isProcessing}
              className="pr-10"
            />
            <Button
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
