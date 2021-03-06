'use strict';

import * as fs from 'fs';
import {Promise} from 'es6-promise'
import RenameInfo from './models/RenameInfo';


class BulkFileNameRenamer {

  private static readonly SETTING_FILE_PATH: string = './renameList.json';

  private static errorHandler(error: any): void {
    console.error(error);
    console.trace();
  }

  public start() : void {
    this.readRenameList()
      .then((renameInfoList) => {
        let promiseList = this.renameFiles(renameInfoList);
        Promise.all(promiseList).then(() => {
          console.log('success');
        }).catch(BulkFileNameRenamer.errorHandler);
      })
      .catch(BulkFileNameRenamer.errorHandler);
  }

  private readRenameList(): Promise<Array<RenameInfo>> {
    return new Promise<Array<RenameInfo>>((resolve, reject) => {
      fs.readFile(BulkFileNameRenamer.SETTING_FILE_PATH, 'utf8', (error, data) => {
        if (error) {
          reject(error);
          return;
        }
        let renameInfoList: Array<RenameInfo> = JSON.parse(data);
        resolve(renameInfoList);
      });
    });
  }

  private renameFiles(renameList: Array<RenameInfo>): Array<Promise<any>> {
    return renameList.map((renameInfo) => {
      return new Promise((resolve, reject) => {
        fs.rename(renameInfo.srcPath, renameInfo.distPath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    })
  }

}

let app = new BulkFileNameRenamer();
app.start();
