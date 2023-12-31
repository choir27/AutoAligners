import PaginatedButtons from "../components/Graphs/PaginatedButtons";
import {
  PurchasedItem,
  DisplayBy,
  DisplayDate,
} from "../middleware/Interfaces";

//three buttons, week, month, year
//on click, they trigger their respective functions
//the month function retrieves the current month
//the week function retrieves the current week
//the year function retrieves the current year

//only list purchases of the current week based on the creation date
//only list purchases of the current month based on the creation date
//only list purchases of the current years based on the creation date

export function DisplayByYear(props: DisplayBy) {
  const date = new Date();
  const currentYear = date.getFullYear();
  const purchasedDates = GetPurchasedDates(props.purchases);
  const filteredDates = purchasedDates.filter(
    (date: DisplayDate | undefined) =>
      date?.date.includes(currentYear.toString()),
  );
  const tableData = filteredDates
    .map((date: DisplayDate | undefined, i: number) => {
      return (
        <tr key={`year-${i}`} className={`${i % 2 === 0 ? "even" : "odd"}`}>
          <td>{date?.date}</td>
          <td>{date?.quantityTotal}</td>
          <td>${date?.totalProfit}</td>
        </tr>
      );
    })
    .slice(props.startIndex, props.endIndex);

  return (
    <section>
      <PaginatedButtons
        className="flex"
        currentPage={props.currentPage}
        cartLength={filteredDates.length}
        setCurrentPage={(e: number) => props.setCurrentPage(e)}
        rowsPerPage={props.rowsPerPage}
      />

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Quantities Sold</th>
            <th>Profit Made</th>
          </tr>
        </thead>
        <tbody>{tableData}</tbody>
      </table>
    </section>
  );
}

export function DisplayByMonth(props: DisplayBy) {
  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  const purchasedDates = GetPurchasedDates(props.purchases);
  const filteredDates = purchasedDates.filter(
    (date: DisplayDate | undefined) =>
      date?.date.split("-")[0].includes(currentYear.toString()) &&
      date?.date.split("-")[1].includes(currentMonth.toString()),
  );

  if (filteredDates.length) {
    const tableData = filteredDates
      .map((date: DisplayDate | undefined, i: number) => {
        return (
          <tr key={`month-${i}`} className={`${i % 2 === 0 ? "even" : "odd"}`}>
            <td>{date?.date}</td>
            <td>{date?.quantityTotal}</td>
            <td>${date?.totalProfit}</td>
          </tr>
        );
      })
      .slice(props.startIndex, props.endIndex);

    return (
      <section>
        <PaginatedButtons
          className="flex"
          currentPage={props.currentPage}
          cartLength={filteredDates.length}
          setCurrentPage={(e: number) => props.setCurrentPage(e)}
          rowsPerPage={props.rowsPerPage}
        />

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Quantities Sold</th>
              <th>Profit Made</th>
            </tr>
          </thead>
          <tbody>{tableData}</tbody>
        </table>
      </section>
    );
  }
}

export function DisplayByWeek(props: DisplayBy) {
  const date = new Date();
  let currentDay = date.getDate();
  let currentMonth = date.getMonth() + 1;
  let currentYear = date.getFullYear();
  let currentDOW = date.getDay();

  let currentWeek: number[] = [];

  let i = 0;

  if (currentDOW) {
    currentDay -= currentDOW;
  }

  while (i < 7) {
    if (!currentWeek.length) {
      currentWeek.push(currentDay);
    } else {
      if (
        (currentMonth === 1 ||
          currentMonth === 3 ||
          currentMonth === 5 ||
          currentMonth === 7 ||
          currentMonth === 8 ||
          currentMonth === 10) &&
        currentDay > 31
      ) {
        currentDay = 1;
        ++currentMonth;
        currentWeek.push(currentDay);
      } else if (
        (currentMonth === 4 ||
          currentMonth === 6 ||
          currentMonth === 9 ||
          currentMonth === 11) &&
        currentDay > 30
      ) {
        currentDay = 1;
        ++currentMonth;
        currentWeek.push(currentDay);
      } else if (currentMonth === 2 && currentDay > 28) {
        currentDay = 1;
        ++currentMonth;
        currentWeek.push(currentDay);
      } else if (currentMonth === 12 && currentDay > 31) {
        currentDay = 1;
        ++currentMonth;
        ++currentYear;
        currentWeek.push(currentDay);
      } else {
        currentWeek.push(++currentDay);
      }
    }
    i++;
  }

  function filterDate(date: string | undefined) {
    return currentWeek.filter((day: number) => day === Number(date));
  }

  const purchasedDates = GetPurchasedDates(props.purchases);
  const filteredDates = purchasedDates.filter(
    (date: DisplayDate | undefined) =>
      date?.date.split("-")[0].includes(currentYear.toString()) &&
      date?.date.split("-")[1].includes(currentMonth.toString()) &&
      filterDate(date?.date.split("-")[2])[0],
  );

  const tableData = filteredDates
    .map((date: DisplayDate | undefined, i: number) => {
      return (
        <tr key={`week-${i}`} className={`${i % 2 === 0 ? "even" : "odd"}`}>
          <td>{date?.date}</td>
          <td>{date?.quantityTotal}</td>
          <td>${date?.totalProfit}</td>
        </tr>
      );
    })
    .slice(props.startIndex, props.endIndex);

  return (
    <section>
      <PaginatedButtons
        className="flex"
        currentPage={props.currentPage}
        cartLength={filteredDates.length}
        setCurrentPage={(e: number) => props.setCurrentPage(e)}
        rowsPerPage={props.rowsPerPage}
      />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Quantities Sold</th>
            <th>Profit Made</th>
          </tr>
        </thead>
        <tbody>{tableData}</tbody>
      </table>
    </section>
  );
}

//return array that returns a list of the date of the purchase
export function GetPurchasedDates(purchases: PurchasedItem[]) {
  return purchases.map((item: PurchasedItem) => {
    //total is here to have a variable to return as a string value
    let total = "";
    let cartTotal: number = 0;
    let decimalTotal: number = 0;
    for (let i = 0; i < item.cartItems.length; i++) {
      let quantityTotal = 0;
      const cartItem: PurchasedItem = JSON.parse(item.cartItems[i]);

      let itemPriceTotal = 0;
      itemPriceTotal = Number(cartItem.price) * parseInt(cartItem.quantity);

      //add the values left of the decimal point to the current cart total
      cartTotal += parseInt(itemPriceTotal.toString().split(".")[0]);

      //only if item total has a decimal point, add those decimals values to the decimal total
      if (itemPriceTotal.toString().includes(".")) {
        decimalTotal += parseInt(
          itemPriceTotal.toFixed(2).toString().split(".")[1],
        );
      }

      //on the last item of the cart, combine the values of the decimal total and the number total as a string
      if (i === item.cartItems.length - 1) {
        //Take decimal total and change it to a string
        let decimalNumbers = decimalTotal.toString().split("");

        //if the total of the decimal sum equals a value that supercedes the decimal place, add the number values left of the decimal place to the cart total
        if (decimalNumbers.length > 2) {
          const remainder: string = decimalNumbers.shift() as string;
          cartTotal += parseInt(remainder);
        }

        //combine the decimal number remainder and the current cart total, and comine them as one string
        const decimals = decimalNumbers.join("");
        total = cartTotal.toString();
        total += "." + decimals;
      }

      //convert current total as string and return it as a number
      const totalProfit = parseInt(total);

      quantityTotal += Number(cartItem.quantity);

      if (totalProfit) {
        return {
          date: cartItem.$createdAt.split("T")[0],
          quantityTotal,
          totalProfit,
        };
      }
    }
  });
}

//return array that returns a list of the total quantities of items sold per purchase
export function GetPurchasedQuantities(purchases: PurchasedItem[]) {
  return purchases.map((item: PurchasedItem) => {
    let quantityTotal = 0;
    for (let i = 0; i < item.cartItems.length; i++) {
      const cartItem: PurchasedItem = JSON.parse(item.cartItems[i]);
      quantityTotal += Number(cartItem.quantity);
    }
    return quantityTotal;
  });
}

//return array that returns a list of the total profit of items sold per purchase
export function GetPurchasedProfit(purchases: PurchasedItem[]) {
  return purchases.map((item: PurchasedItem) => {
    //total is here to have a variable to return as a string value
    let total = "";
    let cartTotal: number = 0;
    let decimalTotal: number = 0;

    for (let i = 0; i < item.cartItems.length; i++) {
      //By changing each element of item.cartItems to an object, we can now access all the properties of the object
      const cartItem: PurchasedItem = JSON.parse(item.cartItems[i]);

      let itemPriceTotal = 0;
      itemPriceTotal = Number(cartItem.price) * parseInt(cartItem.quantity);

      //add the values left of the decimal point to the current cart total
      cartTotal += parseInt(itemPriceTotal.toString().split(".")[0]);

      //only if item total has a decimal point, add those decimals values to the decimal total
      if (itemPriceTotal.toString().includes(".")) {
        decimalTotal += parseInt(
          itemPriceTotal.toFixed(2).toString().split(".")[1],
        );
      }

      //on the last item of the cart, combine the values of the decimal total and the number total as a string
      if (i === item.cartItems.length - 1) {
        //Take decimal total and change it to a string
        let decimalNumbers = decimalTotal.toString().split("");

        //if the total of the decimal sum equals a value that supercedes the decimal place, add the number values left of the decimal place to the cart total
        if (decimalNumbers.length > 2) {
          const remainder: string = decimalNumbers.shift() as string;
          cartTotal += parseInt(remainder);
        }

        //combine the decimal number remainder and the current cart total, and comine them as one string
        const decimals = decimalNumbers.join("");
        total = cartTotal.toString();
        total += "." + decimals;
      }

      //convert current total as string and return it as a number
      const totalProfit = parseInt(total);

      if (totalProfit) {
        return totalProfit;
      }
    }
  });
}
