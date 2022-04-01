package com.ers;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ErsApplication {

	private  static final Logger LOGGER = LogManager.getLogger(ErsApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(ErsApplication.class, args);

		LOGGER.info("Info level log messages");
		LOGGER.debug("Debug level log messages");
		LOGGER.warn("Waning level log messages");
		LOGGER.error("Error level log messages");
	}
}
