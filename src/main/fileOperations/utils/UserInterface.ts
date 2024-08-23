import { dialog } from 'electron';
import {IUserInterface} from "../types/interfaces";

export class UserInterface implements IUserInterface {
  async confirm(question: string): Promise<boolean> {
    const result = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: question,
    });
    return result.response === 0;
  }
}
