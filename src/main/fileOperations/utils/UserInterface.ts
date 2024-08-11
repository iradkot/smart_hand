import { dialog } from 'electron';

export class UserInterface {
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
