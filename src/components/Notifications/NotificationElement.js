class NotificationBlock {
  constructor(date, type, key) {
    this.date = date; // Date
    this.type = type; // 'account' | 'event'
    this.key = key;
  }

  getDate() {
    return this.date;
  }

  getType() {
    return this.type;
  }
   
  getKey() {
    return this.key;
  }

  getNotificationData() {
    // Abstract method must be implemented by sub-class
    // Returns data to display for notification; format of data depends on
    // the type of notification block (account vs event)
  }
}

class AccountNotificationBlock extends NotificationBlock {
  constructor(date, type, key) {
    super(date, type, key);
    this.pendingAccounts = [];
  }

  addPendingAccount(pendingAccount) {
    this.pendingAccounts.push(pendingAccount);
  }

  getNotificationData() {
    return { accounts: this.pendingAccounts };
  }
}

class EventNotificationBlock extends NotificationBlock {
  constructor(date, type, key, title, status) {
    super(date, type, key);
    this.title = title;
    this.status = status; // 'added' | 'confirmed'
  }

  getNotificationData() {
    return { title: this.title, status: this.status };
  }
}

export { AccountNotificationBlock, EventNotificationBlock };
