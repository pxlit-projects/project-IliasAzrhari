# Architecture

![C4-java drawio](https://github.com/user-attachments/assets/9fd90a64-06ab-47be-b78d-e099c836f2f5)


User (Gebruiker)
Rol: Een gebruiker met specifieke acties zoals het bekijken van gepubliceerde berichten, filteren op basis van specificaties, reageren op berichten, en beheren van eigen reacties.
Relatie: Gebruikt de Single Page Application (SPA) om toegang te krijgen tot deze functies.

Editor (Redacteur)
Rol: Een redacteur kan nieuwe berichten maken, berichten opslaan als concept, berichten wijzigen, en opmerkingen plaatsen bij afgewezen berichten, kan berichten goedkeuren of afwijzen en opmerkingen plaatsen bij afgewezen berichten.
Relatie: Heeft interactie met de SPA om berichten te beheren en krijgt meldingen bij goedkeuring of afwijzing van berichten.

Single Page Application (SPA)
Rol: Biedt de functionaliteit van de applicatie in een webbrowser en stelt gebruikers in staat om berichten te bekijken, bewerken, goedkeuren, en op reacties te reageren.
Relatie: Maakt API-aanroepen naar de PostService API, ReviewService API, en CommentService API voor het uitvoeren van verschillende acties. Verzendt en ontvangt berichten van de Open-Feign browser voor communicatie met andere microservices.

Open-Feign Browser
Rol: Een REST-client die gebruikmaakt van load balancing (via Ribbon) voor communicatie met andere microservices.
Relatie: Publiceert en ontvangt berichten via HTTP om te communiceren met de andere API's in het systeem.
Services en API's
PostService

PostService API
Rol: Verantwoordelijk voor de functionaliteit van het beheren van berichten.
Relatie: Verbindt met de PostService Database om berichten op te slaan en te lezen via SQL. Maakt gebruik van RabbitMQ Container voor het publiceren en consumeren van berichten met andere services.
PostService Database
Rol: Opslagplaats voor berichten.
Relatie: Wordt aangesproken door de PostService API voor lezen en schrijven van gegevens.
ReviewService

ReviewService API
Rol: Beheert de functionaliteit rondom beoordelingen van berichten (goedkeuring of afwijzing).
Relatie: Verbindt met de ReviewService Database voor lezen en schrijven van beoordelingen via SQL. Communiceert met andere services via RabbitMQ Container voor berichtenuitwisseling.
ReviewService Database
Rol: Opslagplaats voor beoordelingen.
Relatie: Wordt aangesproken door de ReviewService API voor het lezen en schrijven van beoordelingen.
CommentService

CommentService API
Rol: Beheert de functionaliteit voor opmerkingen op berichten.
Relatie: Verbindt met de CommentService Database om reacties op te slaan en op te halen via SQL. Communiceert via RabbitMQ Container met andere services voor berichtenuitwisseling.
CommentService Database
Rol: Opslagplaats voor opmerkingen.
Relatie: Wordt aangesproken door de CommentService API voor het lezen en schrijven van reacties.

RabbitMQ Container
Rol: Biedt berichtgeving en asynchrone communicatie tussen verschillende microservices (AMQP).
Relatie: Wordt gebruikt door de PostService, ReviewService, en CommentService voor het publiceren en consumeren van berichten tussen services.

Config Service
Rol: Een centrale configuratieservice voor alle application.properties van de microservices. Het zorgt ervoor dat alle microservices toegang hebben tot een gedeelde configuratiebron, wat het beheer van configuraties vereenvoudigt. Dit maakt het gemakkelijker om configuratie-instellingen centraal aan te passen zonder elk component afzonderlijk te hoeven bijwerken.
Relatie: Alle microservices kunnen verbinding maken met de Config Service om hun configuratie-instellingen op te halen. Dit zorgt voor consistentie en centralisatie van de configuraties over het hele systeem.

Discovery Service
Rol: Verantwoordelijk voor service-registratie en -ontdekking, wat essentieel is voor dynamische microservices-architecturen. Alle microservices registreren zichzelf bij de Discovery Service. Hierdoor kan elke service andere services in het systeem ontdekken en op basis daarvan communiceren, zonder afhankelijk te zijn van harde URL’s of IP-adressen.
Relatie: Alle microservices melden zich aan bij de Discovery Service, die dient als een directory of registry. Wanneer een service communicatie met een andere service wil opzetten, kan het via de Discovery Service de locatie en status van die service vinden.

Relaties en Interactie
API-aanroepen: De SPA maakt HTTP-aanroepen naar de verschillende service API’s (PostService API, ReviewService API, en CommentService API) voor toegang tot respectievelijke functionaliteiten.
Messaging/Communicatie: De RabbitMQ Container fungeert als een tussenlaag voor berichtenuitwisseling tussen de microservices, waardoor asynchrone communicatie mogelijk is. Dit stelt de services in staat om berichten te publiceren en te consumeren zonder directe afhankelijkheden.
Data Opslag: Elke service heeft een eigen SQL-database voor het opslaan van zijn specifieke gegevens (berichten, beoordelingen, reacties). De API’s van elke service beheren de toegang tot hun respectievelijke databases.

