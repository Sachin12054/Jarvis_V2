class JarvisException(Exception):
    """Base exception class for JARVIS application errors."""

    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class ConversationNotFoundError(JarvisException):
    """Raised when a requested conversation does not exist."""

    def __init__(self, conversation_id: str):
        super().__init__(
            message=f"Conversation with ID '{conversation_id}' was not found.",
            status_code=404,
        )


class LLMProviderError(JarvisException):
    """Raised when an LLM provider encounters an unrecoverable failure."""

    def __init__(self, provider: str, details: str):
        super().__init__(
            message=f"LLM Provider '{provider}' error: {details}",
            status_code=502,
        )


class LLMTimeoutError(LLMProviderError):
    """Raised when an LLM request times out."""

    def __init__(self, provider: str):
        super().__init__(
            provider=provider,
            details="Request timed out.",
        )


class ConfigurationError(JarvisException):
    """Raised when required settings or configurations are missing/invalid."""

    def __init__(self, details: str):
        super().__init__(
            message=f"Configuration Error: {details}",
            status_code=500,
        )
