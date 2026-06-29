import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent, type ClipboardEvent } from "react";

interface UseOTPOptions {
    length?: number;
    initialTimeLeft?: number;
}

export function useOTP({ length = 6, initialTimeLeft = 60 }: UseOTPOptions = {}) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);
    const inputRef = useRef<(HTMLInputElement | null)[]>(new Array(length).fill(null));

    // Focus on first input on mount
    useEffect(() => {
        inputRef.current[0]?.focus();
    }, []);

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (!/^[0-9]*$/.test(value)) return;

        const newOTP = [...otp];
        newOTP[index] = value.substring(value.length - 1);
        setOtp(newOTP);

        if (value && index < length - 1) {
            setActiveOTPIndex(index + 1);
            inputRef.current[index + 1]?.focus();
        }
    };

    const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newOTP = [...otp];

            // If current input is empty, move back and clear the previous one
            if (!otp[index] && index > 0) {
                newOTP[index - 1] = "";
                setActiveOTPIndex(index - 1);
                inputRef.current[index - 1]?.focus();
            } else {
                // Otherwise clear current input
                newOTP[index] = "";
            }
            setOtp(newOTP);
        } else if (e.key === "ArrowLeft" && index > 0) {
            e.preventDefault();
            setActiveOTPIndex(index - 1);
            inputRef.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            e.preventDefault();
            setActiveOTPIndex(index + 1);
            inputRef.current[index + 1]?.focus();
        }
    };

    const handleOnPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length);

        if (pastedData) {
            const newOTP = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOTP[i] = pastedData[i];
            }
            setOtp(newOTP);

            const nextIndex = Math.min(pastedData.length, length - 1);
            setActiveOTPIndex(nextIndex);
            inputRef.current[nextIndex]?.focus();
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const resetOTP = () => {
        setTimeLeft(initialTimeLeft);
        setOtp(new Array(length).fill(""));
        setActiveOTPIndex(0);
        inputRef.current[0]?.focus();
    };

    return {
        otp,
        activeOTPIndex,
        inputRef,
        timeLeft,
        handleOnChange,
        handleOnKeyDown,
        handleOnPaste,
        setActiveOTPIndex,
        formatTime,
        resetOTP
    };
}
