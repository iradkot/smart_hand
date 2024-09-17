import { dialog } from 'electron';
import { IUserInterface } from "../types/interfaces";

export class UserInterface implements IUserInterface {
  async confirm(question: string): Promise<boolean> {
    return await promptUserConfirmation(question);
  }
}

export async function promptUserConfirmation(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 0,
      cancelId: 1,
      title: 'Confirm',
      message: message,
    }).then(result => {
      resolve(result.response === 0); // 0 for 'Yes'
    }).catch(() => {
      resolve(false);
    });
  });
}
