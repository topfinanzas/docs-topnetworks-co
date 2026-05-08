# Remote vs Local Directory Mapping

Based on remote inspection of `/var/www/html` and local `repositories.json`, the synchronized TopNetworks Inc. project directories are mapped as follows:

1. **TopFinanzas US**
   - **Local Path**: `/Users/macbookpro/GitHub/topfinanzas-us-next`
   - **Remote Path**: `/var/www/html/topfinanzas-us-next`
   - **Deployment Script**: `./scripts/deploy_update.sh`

2. **TopFinanzas UK**
   - **Local Path**: `/Users/macbookpro/GitHub/uk-topfinanzas-com`
   - **Remote Path**: `/var/www/html/uk` (NOTE: Naming discrepancy vs local repo)
   - **Deployment Script**: `./scripts/deploy_update.sh`

3. **TopFinanzas MX**
   - **Local Path**: `/Users/macbookpro/GitHub/topfinanzas-mx-next`
   - **Remote Path**: `/var/www/html/topfinanzas-mx-next` 
   - **Deployment Script**: `./scripts/deploy_update.sh`

4. **BudgetBee**
   - **Local Path**: `/Users/macbookpro/GitHub/budgetbee-next`
   - **Remote Path**: `/var/www/html/budgetbee-next`
   - **Deployment Script**: `./scripts/deploy_update.sh`

*Note: Some legacy directories (like `budgetbee` and `us`) exist on the remote server but deployment targets the Next.js directories indicated above.*
