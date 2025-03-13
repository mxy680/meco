import logging


class Logger:
    def __init__(self, log_file: str = "evolution.log"):
        """
        Initializes the logger with a file handler and a stream handler.
        """
        self.log_file = log_file
        self._configure_logger()
        self.log("Logger initialized.", "info")

    def _configure_logger(self):
        self.logger = logging.getLogger("EvolutionLogger")
        self.logger.setLevel(logging.DEBUG)
        # Clear existing handlers if any
        if self.logger.hasHandlers():
            self.logger.handlers.clear()

        # File handler for detailed logs
        file_handler = logging.FileHandler(self.log_file)
        file_handler.setLevel(logging.DEBUG)
        # Console handler for high-level events
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.DEBUG)

        formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)

    def log(self, message: str, level: str = "info"):
        """
        Logs a general message at the specified level.
        """
        if level.lower() == "debug":
            if message and message != "\n":
                self.logger.debug(f"{message}")
        elif level.lower() == "warning":
            self.logger.warning(message)
        elif level.lower() == "error":
            self.logger.error(message)
        else:
            self.logger.info(message)
