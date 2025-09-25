import { toBigInt } from "ethers"; // helper

export function swap(orderBook, balances) {
  // Work on copies
  let book = [...orderBook];
  let bals = structuredClone(balances);

  // turn any plain numbers back to bigint
  for (const user of Object.keys(bals)) {
    for (const token of Object.keys(bals[user])) {
      bals[user][token] = toBigInt(bals[user][token]);
    }
  }

  let i = 0;
  while (i < book.length) {
    const orderA = book[i];
    let matched = false;

    for (let j = i + 1; j < book.length; j++) {
      const orderB = book[j];

      if (
        orderA.give === orderB.take &&
        orderA.take === orderB.give
      ) {
        // all bigints now
        const giveA = toBigInt(orderA.giveAmount);
        const takeA = toBigInt(orderA.takeAmount);
        const giveB = toBigInt(orderB.giveAmount);
        const takeB = toBigInt(orderB.takeAmount);

        // choose amounts to fill (smaller side)
        const amountAToGive = giveA < takeB ? giveA : takeB;
        const amountBToGive = giveB < takeA ? giveB : takeA;

        if (
          (bals[orderA.user]?.[orderA.give] ?? 0n) >= amountAToGive &&
          (bals[orderB.user]?.[orderB.give] ?? 0n) >= amountBToGive
        ) {
          // transfer A → B
          bals[orderA.user][orderA.give] -= amountAToGive;
          bals[orderB.user][orderA.give] =
            (bals[orderB.user][orderA.give] ?? 0n) + amountAToGive;

          // transfer B → A
          bals[orderB.user][orderB.give] -= amountBToGive;
          bals[orderA.user][orderB.give] =
            (bals[orderA.user][orderB.give] ?? 0n) + amountBToGive;

          // reduce order amounts
          book[i] = {
            ...orderA,
            giveAmount: giveA - amountAToGive,
            takeAmount: takeA - amountBToGive
          };
          book[j] = {
            ...orderB,
            giveAmount: giveB - amountBToGive,
            takeAmount: takeB - amountAToGive
          };

          // remove fully filled
          if (
            book[i].giveAmount === 0n || book[i].takeAmount === 0n
          ) {
            book.splice(i, 1);
            j--;
          }
          if (
            book[j] &&
            (book[j].giveAmount === 0n || book[j].takeAmount === 0n)
          ) {
            book.splice(j, 1);
            j--;
          }

          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      i++;
    }
  }

  return { orderBook: book, balances: bals };
}
