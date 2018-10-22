import MessageType from "./Enums";

export default interface IMessage {
    messageId: MessageType;
    x?: number;
    y?: number;
    z?: number;
    objectId?: string;
    uuid?: string;
    currentScore?: number[];
    currentMultipliers?: number[];
    currentGoals?: number[];
    winnerUsername?: string;
    scoredBy?: string;
}