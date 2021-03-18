# MoonStonks Börsen API

Offizielle API der MoonStonks Börse, um jegliche Art von Order zu stellen.

## Installation

```shell
npm install moonstonks-boersenapi
```
oder

```shell
yarn add moonstonks-boersenapi
```

## Setup

```ts
import { BörsenAPI } from 'moonstonks-boersenapi';

public api = new BörsenAPI('moonstonks token')
```

## Eine Order stellen
Es gibt viele verschiedene Orders, diese können je nach bedarf dynamisch oder statisch gestellt werden. Hierzu gibt es mehrere Methoden, welche über unsere **BörsenAPI** erreichbar sind.

```ts
import { OrderManager } from "moonstonks-boersenapi";

public orderManager = new OrderManager(api, 'onPlace' 'onMatch', 'onComplete', 'onDelete')
```

### Eine Buy Market Order stellen

> ```ts
> async function placeBuyMarketOrder(shareId: string, amount: number): Promise<Job>
> ```
```ts
orderManager.placeBuyMarketOrder("shareId", 20)
  .then((job) => console.log('Job', job))
  .catch((error) => console.error(error));
```

### Eine Buy Limit Order stellen
> ```ts
> async function placeBuyLimitOrder(shareId: string, amount: number, limit: number): Promise<Job>
> ```
```ts
orderManager.placeBuyLimitOrder("shareId", 20, 200)
  .then((job) => console.log('Job', job))
  .catch((error) => console.error(error));
```

### Eine Buy Stop Market Order stellen
> ```ts
> async function placeBuyStopMarketOrder(shareId: string, amount: number, stop: number): Promise<Job>
> ```
```ts
orderManager.placeBuyStopMarketOrder("shareId", 20, 200, 300)
  .then((job) => console.log('Job', job))
  .catch((error) => console.error(error));
```

### Eine Buy Stop Limit Order stellen
> ```ts
> async function placeBuyStopLimitOrder(shareId: string, amount: number, limit: number, stop: number): Promise<Job>
> ```
```ts
orderManager.placeBuyStopLimitOrder("shareId", 20, 200, 350, 300)
  .then((job) => console.log('Job', job))
  .catch((error) => console.error(error));
```

### Eine Sell Market Order stellen

> ```ts
> async function placeSellMarketOrder(shareId: string, amount: number): Promise<Job>
> ```
```ts
orderManager.placeSellMarketOrder("shareId", 20)
  .then((job) => console.log('Job', job))
  .catch((error) => console.error(error));
```

### Eine Sell Limit Order stellen
> ```ts
> async function placeSellLimitOrder(shareId: string, amount: number, limit: number): Promise<Job>
> ```
```ts
orderManager.placeSellLimitOrder("shareId", 20, 200)
  .then((job) => console.log('Job', job))
  .catch((error) => console.error(error));
```

### Eine Sell Stop Market Order stellen
> ```ts
> async function placeSellStopMarketOrder(shareId: string, amount: number, stop: number): Promise<Job>
> ```
```ts
orderManager.placeSellStopMarketOrder("shareId", 20, 200, 300)
  .then((job) => console.log('Job', job))
  .catch((error) => console.error(error));
```

### Eine Sell Stop Limit Order stellen
> ```ts
> async function placeSellStopLimitOrder(shareId: string, amount: number, limit: number, stop: number): Promise<Job>
> ```
```ts
orderManager.placeSellStopLimitOrder("shareId", 20, 200, 350, 300)
  .then((job) => console.log('Job', job))
  .catch((error) => console.error(error));
```


## Shares

Shares sind items, welche in der MoonStonks Börse gehandelt werden können. Hierzu stellt die Börse verschiedene Methoden zur Verfügung, um Informationen wie den aktuellen Kurs, die Preisentwicklung und andere abzurufen.

```ts
import { ShareManager } from "moonstonks-boersenapi";
```

### Alle handelbaren Items abrufen

> ```ts
> static async function getShares(): Promise<Share[]>
> ```
```ts
ShareManager.getShares();
```

### Den aktuellen Kurs eines items erhalten

> ```ts
> static async function getPrice(shareId: string): Promise<number>
> ```
```ts
ShareManager.getPrice("shareId");
```

### Die Preisentwicklung abrufen
> ```ts
> static async function getPrices(shareId: string): Promise<Price[]>
> ```
```ts
ShareManager.getPrices("shareId");
ShareManager.getPricesFrom("shareId", from);
ShareManager.getPricesUntil("shareId", until);
ShareManager.getPricesFromUntil("shareId", from, until);
```

## Market

```ts
import { MarketManager } from "moonstonks-api"
```

### Prüfen, ob der Market gerade geöffnet ist
> ```ts
> static async function isOpen(): Promise<boolean>
> ```
```ts
MarketManager.isOpen();
```

### Prüfen, ob der Market gerade geschlossen ist

> ```ts
> async function isClosed(): Promise<boolean>
> ```
```ts
MarketManager.isClosed();
```

### Den aktuellen Status des Markets abrufen
> ```ts
> static async function getStatus(): Promise<string>
> ```
```ts
MarketManager.getStatus();
```

# Datenmodelle

## Order

| Attribut | Type | Beschreibung |
|:--|:--|:--|
|id|string|eindeutige Order ID|
|shareId|string|ID des gewählten Shares|
|timestamp|number|Zeitstempel des Stellens der Order|
|type|"buy" \| "sell"|Ordertyp: Kauf- oder Verkaufsorder|
|amount|number|Menge der zu kaufenden/verkaufenden Shares|
|limit?|number|Limit zu dem man diese Order ausführen möchte; Wenn leer = Marketorder|
|stop?|number|Grenze der Stop-Market Order|

___
## Job

| Attribut | Type | Beschreibung |
|:--|:--|:--|
|id|string|eindeutige Job ID|
|broker|Broker|Job Owner|
|placeOrder?|PlaceOrderDto|Bündel der Daten für das Platzieren einer Order|
|deleteOrder?|DeleteOrderDto|Bündel der Daten für das Löschen einer Order|

___

## Share

| Attribut | Type | Beschreibung |
|:--|:--|:--|
id|string|eindeutige Share ID|
name|string|Name des Shares|
color|string|Farbe zur Identifikation des Shares|
thumbnail|string|Bild/Grafik zur Identifikation des Shares|
price|string|aktueller Preis des Shares|

___
## Price

| Attribut | Type | Beschreibung |
|:--|:--|:--|
timestamp|number|Zeitstempel des aktuellen Preises|
price|number|Höhe des aktuellen Preises|
  ___
## Broker

| Attribut | Type | Beschreibung |
|:--|:--|:--|
|type|'private' \| 'business' \| 'simulation' \| 'stockmarket'|Art des Brokers|
|displayName|string|Anzeigename des Brokers|

# DTOs

## PlaceOrderDto

| Attribut | Type | Beschreibung |
|:--|:--|:--|
|shareId|string|Id des gewählten Shares|
|amount|number|Menge der zu handelnden Shares dieser Order|
|onPlace|string|aufgerufener Endpunkt vom Broker, wenn Order platziert wird|
|onMatch|string|aufgerufener Endpunkt vom Broker, wenn Order gematcht wird|
|onComplete|string|aufgerufener Endpunkt vom Brokert, wenn Order ausgeführt|
|onDelete|string|aufgerufener Endpunkt vom Broker, wenn Order gelöscht wird|
|type|'buy' \| 'sell'|Ordertyp: Kauf- oder Verkaufsorder|
|limit?|number|Limit zu dem man diese Order ausführen möchte, wenn leer = Marketorder|
|stop?|number|Grenze der Order|

## UnqueueJobDto

| Attribut | Type | Beschreibung |
|:--|:--|:--|
|jobId|string|eindeutige Job ID|

___
## DeleteOrderDto

| Attribut | Type | Beschreibung |
|:--|:--|:--|
|orderId|string|eindeutige Order ID|

___

//
TBC..

