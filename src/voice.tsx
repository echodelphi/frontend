import {h} from "preact"
import {useState, useEffect, useRef} from "preact/hooks"
import VoiceToText from "voice2text"

interface VoiceEvent extends CustomEvent {
    detail: {
        type: "PARTIAL" | "FINAL" | "STATUS";
        text: string;
    };
}

const VOICE_EVENT_NAME = "voice"

export function Voice() {
    const [transcript, setTranscript] = useState<string>("")
    const [partialTranscript, setPartialTranscript] = useState<string>("")
    const [status, setStatus] = useState<string>("")
    const [isListening, setIsListening] = useState<boolean>(false)
    const voice2textRef = useRef<VoiceToText>(null)

    useEffect(() => {
        try {
            voice2textRef.current = new VoiceToText({
                converter: "vosk",
                language: "en",
                sampleRate: 16000,
            })
        } catch (error) {
            console.error("Failed to initialize VoiceToText:", error)
            setStatus("Error: Failed to initialize voice recognition")
            return
        }

        const handleVoiceEvent = (e: VoiceEvent) => {
            switch (e.detail.type) {
                case "PARTIAL":
                    setPartialTranscript(e.detail.text)
                    break
                case "FINAL":
                    setTranscript((prev) => prev + (prev ? " " : "") + e.detail.text)
                    setPartialTranscript("")
                    break
                case "STATUS":
                    setStatus(e.detail.text)
                    break
            }
        }

        window.addEventListener(VOICE_EVENT_NAME, handleVoiceEvent as EventListener)

        return () => {
            window.removeEventListener(VOICE_EVENT_NAME, handleVoiceEvent as EventListener)
            if (voice2textRef.current) {
                voice2textRef.current.stop()
            }
        }
    }, [])

    const toggleListening = () => {
        if (voice2textRef.current) {
            try {
                if (isListening) {
                    voice2textRef.current.stop()
                } else {
                    voice2textRef.current.start()
                }
                setIsListening(! isListening)
            } catch (error) {
                console.error("Error toggling listening state:", error)
                setStatus("Error: Failed to toggle listening state")
            }
        } else {
            setStatus("Error: Voice recognition not initialized")
        }
    }

    return (
        <div className="voice-transcription">
            <h1 className="title">Voice Transcription</h1>
            <button className={`toggle-button ${isListening ? "listening" : ""}`} onClick={toggleListening}>
                {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <p className="status">Status: {status}</p>
            <div className="transcript-container">
                Foo
            </div>
            <div className="transcript-container">
                <h2 className="subtitle">Transcript:</h2>
                <p className="transcript">{transcript}</p>
                {partialTranscript && (
                    <p className="partial-transcript">{partialTranscript}</p>
                )}
            </div>
        </div>
    )
}
