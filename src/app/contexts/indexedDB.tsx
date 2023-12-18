import { Message } from "@/types/api";
import React from "react";
import { EnumType, Enum, Result, Option } from "rusty-enum";
import { OptionPromise, ResultPromise } from "rusty-enum/dist/async";

type Chat = {
    id?: MessageId;
    createdAt: number;
    messages: Message[];
};
type MessageId = number;

type IDBAccessFunctions = {
    chatHistory: {
        createChat(messages: Message[]): Promise<void>;
        deleteChat(messageId: MessageId): Promise<void>;
        appendChat(messageId: MessageId, messages: Message[]): Promise<void>;
        getChat(messageId: MessageId): OptionPromise<Chat>;
    }
};

type IDBState = {
    NotSupported: null;
    Error: string;
    Loading: null;
    Ok: IDBAccessFunctions;
};
const IDBState = Enum<IDBState>();
const GetChat = Enum<Option<Chat>>();

const DB_VERSION = 1;
const DB_NAME = "gpt4-db";

const HISTORY_CHAT_STORE = "history-chats"

const IDBContext = React.createContext<EnumType<IDBState>>(IDBState.Loading());

export const IDBContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {

    const [db, setDB] = React.useState<IDBDatabase | null>(null);
    const [state, setState] = React.useState<EnumType<IDBState>>(IDBState.Loading());

    const accessFns: IDBAccessFunctions = {
        chatHistory: {
            async createChat(messages) {
                if (!db) return;
                return new Promise((res, _) => {
                    const newChat: Chat = {
                        createdAt: Date.now(), 
                        messages
                    };

                    const transaction = db.transaction([HISTORY_CHAT_STORE], "readwrite");
                    transaction.oncomplete = _ => res();
                    transaction.onerror = ev => {
                        console.error(ev);
                        res();
                    }

                    transaction
                        .objectStore(HISTORY_CHAT_STORE)
                        .add(newChat);
                });
            },
            async deleteChat(messageId) {
                if (!db) return;
                return new Promise((res, _) => {
                    const transaction = db.transaction([HISTORY_CHAT_STORE], "readwrite");
                    transaction.oncomplete = _ => res();
                    transaction.onerror = ev => {
                        console.error(ev);
                        res();
                    }
                    transaction
                        .objectStore(HISTORY_CHAT_STORE)
                        .delete(messageId);
                });
            },
            async appendChat(messageId, message) {
                if (!db) return;
                return new Promise((res, _) => {
                    const transaction = db.transaction([HISTORY_CHAT_STORE], "readwrite");
                    transaction.oncomplete = _ => res();
                    transaction.onerror = ev => {
                        console.error(ev);
                        res();
                    }
                    const store = transaction.objectStore(HISTORY_CHAT_STORE);
                    store.get(messageId)
                        .onsuccess = ev => {
                            const chat: Chat | undefined = (ev.target as any).result;
                            if (!chat) return;
                            chat.messages = chat.messages.concat(message);
                            store.put(chat);
                        }
                        
                });
            },
            async getChat(messageId) {
                if (!db) return GetChat.None();
                return new Promise((res, _) => {
                    let chat: Chat;
                    const transaction = db.transaction([HISTORY_CHAT_STORE], "readwrite");
                    transaction.oncomplete = _ => res(GetChat.Some(chat));
                    transaction.onerror = ev => {
                        console.error(ev);
                        res(GetChat.None());
                    }
                    transaction.objectStore(HISTORY_CHAT_STORE)
                        .get(messageId);
                });
            },
        }
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
            setState(IDBState.Ok(accessFns));
            setDB(request.result);
        }

        request.onupgradeneeded = ev => {
            const db = ((ev.target) as any as { result: IDBDatabase }).result;

            const historyStore = db.createObjectStore(HISTORY_CHAT_STORE, { keyPath: "id", autoIncrement: true });

            historyStore.createIndex("createdAt", "createdAt", { unique: false });
            setDB(db);

        }

        return () => {
            request.onerror = null;
            request.onsuccess = null;
            request.onupgradeneeded = null;
        }

    }, []);

    return <IDBContext.Provider value={state}>
        {children}
    </IDBContext.Provider>
};
