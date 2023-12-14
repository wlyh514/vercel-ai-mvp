import { Message } from "@/types/api";
import React from "react";
import {EnumType, enumFactory} from "rusty-enum";

type Chat = {
    createdAt: number;
    messages: Message[];
};
type MessageId = number;

type IDBAccessFunctions = {
    chatHistory: {
        createChat: (messages: Message[]) => void; 
        deleteChat: (messageId: MessageId) => void; 
        appendChat: (messageId: MessageId, message: Message) => void; 
        getChat: (MessageId: MessageId) => Promise<Chat>;
    }
};

type IDBState = {
    NotSupported: null;
    Error: string; 
    Loading: null;
    Ok: IDBAccessFunctions;
};
const IDBState = enumFactory<IDBState>();

const DB_VERSION = 1; 
const DB_NAME = "gpt4-db";

const IDBContext = React.createContext<EnumType<IDBState>>(IDBState.Loading());

export const IDBContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const [db, setDB] = React.useState<IDBDatabase | null>(null);
    const [state, setState] = React.useState<EnumType<IDBState>>(IDBState.Loading());

    const accessFns: IDBAccessFunctions = {

    };

    React.useEffect(() => {
        if (!("indexedDB" in window)) {
            setState(IDBState.NotSupported());
            return;
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = ev => {
            setState(IDBState.Error((ev as any).errorCode));
        }

        request.onsuccess = _ => {
            setState(IDBState.Ok({}));
            setDB(request.result);
        }

        request.onupgradeneeded = ev => {
            const db = ((ev.target) as any as {result: IDBDatabase}).result;

            const historyStore = db.createObjectStore("history-chats", {autoIncrement: true});

            historyStore.createIndex("createdAt", "createdAt", {unique: false});
            setDB(db);
            
        }

        return () => {
            request.onerror = null;
            request.onsuccess = null;
            request.onupgradeneeded = null;
        }

    }, []);

    return <IDBContext.Provider value={state}>
        { children }
    </IDBContext.Provider>
};
