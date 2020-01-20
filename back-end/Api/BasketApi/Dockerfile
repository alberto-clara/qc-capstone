FROM mcr.microsoft.com/dotnet/core/sdk:2.2
WORKDIR /BasketApi
COPY ["BasketApi.csproj", "BasketApi/"]
RUN dotnet restore "BasketApi/BasketApi.csproj"
COPY . .
WORKDIR "/BasketApi"
RUN dotnet build "BasketApi.csproj" -c Release -o /rel
RUN dotnet publish "BasketApi.csproj" -c Release -o /app
EXPOSE 80:7003
WORKDIR /app
ENTRYPOINT ["dotnet", "BasketApi.dll"]