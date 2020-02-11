FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 64341
EXPOSE 7001

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY CatalogApi/CatalogApi.csproj CatalogApi/
RUN dotnet restore CatalogApi/CatalogApi.csproj
COPY . .
WORKDIR /src/CatalogApi
RUN dotnet build CatalogApi.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish CatalogApi.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CatalogApi.dll"]
