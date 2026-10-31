# syntax=docker/dockerfile:1.7
FROM node:26.13.0-alpine AS runtime

# The API runs directly with Node.js and does not need package managers at
# runtime. Removing npm/npx also removes their unused dependency tree from the
# final image, reducing both image attack surface and vulnerability findings.
RUN rm -rf /usr/local/lib/node_modules/npm \
  && rm -f /usr/local/bin/npm /usr/local/bin/npx

ENV NODE_ENV=production \
    PORT=8080

WORKDIR /app
COPY --chown=node:node apps/demo-api/package.json ./package.json
COPY --chown=node:node apps/demo-api/src ./src

USER node
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/health/ready').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
