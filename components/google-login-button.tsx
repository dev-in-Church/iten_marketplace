"use client";

import { useEffect, useCallback, useRef } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
              shape?: string;
            }
          ) => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  onCredentialResponse: (credential: string) => void;
  text?: string;
}

export function GoogleLoginButton({ onCredentialResponse, text = "signin_with" }: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      onCredentialResponse(response.credential);
    },
    [onCredentialResponse]
  );

  useEffect(() => {
    if (!clientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: text as string,
          shape: "rectangular",
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [clientId, handleCredentialResponse, text]);

  if (!clientId) {
    return null;
  }

  return (
    <div className="w-full flex justify-center">
      <div ref={buttonRef} />
    </div>
  );
}
