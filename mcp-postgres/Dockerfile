FROM node:24-alpine
RUN npm install -g @modelcontextprotocol/server-postgres supergateway
EXPOSE 3100
CMD ["supergateway", "--port", "3100", "--outputTransport", "streamableHttp", "--stdio", "mcp-server-postgres postgresql://cards_user:cards_pass@db:5432/cards_db"]
