FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 7003

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY CheckoutApi/CheckoutApi.csproj CheckoutApi/
RUN dotnet restore CheckoutApi/CheckoutApi.csproj
COPY . .
WORKDIR /src/CheckoutApi
RUN dotnet build CheckoutApi.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish CheckoutApi.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CheckoutApi.dll"]