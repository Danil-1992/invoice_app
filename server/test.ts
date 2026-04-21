import InvoiceService from './src/services/invoice.service';

async function test() {
  await InvoiceService.getInvoicesItems(1);
}

test();
