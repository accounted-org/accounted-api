import 'dotenv/config';
import './observability/tracing.service';

import { BackofficeSetup } from './backoffice.setup';
import { CoreSetup } from './core.setup';

class Main {
  constructor() {
    void this.boostrap();
  }

  private async boostrap() {
    await new CoreSetup().execute();
    await new BackofficeSetup().execute();
  }
}

void new Main();
