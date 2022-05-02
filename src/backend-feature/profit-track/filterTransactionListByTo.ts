import { ScanServiceApiTransaction } from "backend-feature/types";

export function filterTransactionListByTo(
  transactionList: ScanServiceApiTransaction[],
  toAddress: string
) {
  return transactionList.filter((transaction) => {
    return (
      transaction.to.toLocaleLowerCase() === toAddress.toLocaleLowerCase() &&
      !Number(transaction.isError)
    );
  });
}
