CC = gcc
CFLAGS = -Wall -Wextra -std=c99 -O2
LDFLAGS = 
TARGET = libjonesum.a
SOURCES = src/jonesum.c
OBJECTS = $(SOURCES:.c=.o)
HEADERS = src/jonesum.h

.PHONY: all clean test

all: $(TARGET)

$(TARGET): $(OBJECTS)
	ar rcs $(TARGET) $(OBJECTS)
	ranlib $(TARGET)

%.o: %.c $(HEADERS)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(TARGET)

test: $(TARGET)
	@echo "C library built successfully: $(TARGET)"
	@echo "Use the Python or Node.js bindings to test the functionality"
