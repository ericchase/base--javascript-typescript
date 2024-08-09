export class AnchorDownloader {
  static download(data: string, filename: string, mimetype: string) {
    const a = document.createElement('a');
    a.setAttribute('href', `data:${mimetype};charset=utf-8,${encodeURIComponent(data)}`);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  static JSON(data: string, filename: string) {
    AnchorDownloader.download(data, filename, 'application/json');
  }
  static Text(data: string, filename: string) {
    AnchorDownloader.download(data, filename, 'text/plain');
  }
}
