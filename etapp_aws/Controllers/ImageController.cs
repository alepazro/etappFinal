using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using etapp_aws.Model;
using etws;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace etapp_aws.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        
        //private readonly IAmazonS3 amazonS3;
        private readonly BasicAWSCredentials _awsCredentials;
        private readonly DataLayer _dl = new DataLayer();
        public ImageController()
        {
            _awsCredentials = new BasicAWSCredentials("AKIA2B34XEBYOPCGPYUM", "62koCjv7xgFJpj8OHnsq8Sq2XZNvKHwo3ZvzHT1S");

        }

        [HttpGet("{token}")]
        public async Task<IActionResult> Getimage(string fileName,string token)
        {
            try {
                AmazonS3Config config = new AmazonS3Config()
                {
                    RegionEndpoint = Amazon.RegionEndpoint.USEast1
                };
                using var client = new AmazonS3Client(_awsCredentials, config);
                using GetObjectResponse response = await client.GetObjectAsync("etappmovil-buket", fileName);
                using Stream responseStream = response.ResponseStream;
                var stream = new MemoryStream();
                await responseStream.CopyToAsync(stream);
                stream.Position = 0;
                return new FileStreamResult(stream, response.Headers["Content-Type"])
                {
                    FileDownloadName = fileName,
                };

            }
            catch (AmazonS3Exception e)
            {
            }
            catch (Exception e) {
            }
            return null;              
        }
        
        [HttpPost("{token}")]
        public async Task<IActionResult> Postimg([FromForm] IFormFile file, string token,string jobid)
        {
            awsresponse response = new awsresponse();
            string transid = "";
            string msg = "";
            bool isok = false;

            bool result= _dl.postImage("-1", token, jobid,0,"-1","", file.FileName,"",DateTime.Now, (decimal)0.0, (decimal)0.0,null,ref isok, ref transid, ref msg);
            try
            {
                using (var client = new AmazonS3Client("AKIA2B34XEBYOPCGPYUM", "62koCjv7xgFJpj8OHnsq8Sq2XZNvKHwo3ZvzHT1S", RegionEndpoint.USEast1))
                {
                    using (var newMemoryStream = new MemoryStream())
                    {
                        file.CopyTo(newMemoryStream);

                        var uploadRequest = new TransferUtilityUploadRequest
                        {
                            InputStream = newMemoryStream,
                            Key = file.FileName, // filename
                            BucketName = "etappmovil-buket" // bucket name of S3
                        };
                        //var fileTransferUtility = new TransferUtility(client);
                        //await fileTransferUtility.UploadAsync(uploadRequest);
                        response.statusCode = 200;
                        response.message = $"{file.FileName} has been uploaded successfully";
                    }
                }
            }
            catch (AmazonS3Exception ex)
            {
                response.statusCode = (int)ex.StatusCode;
                response.message = ex.Message;
            }
            catch (Exception ex)
            {
                response.statusCode = 500;
                response.message = ex.Message;
            }

            //var putRequest = new PutObjectRequest(){

            //    BucketName = "etapptestbucket",
            //        Key=file.FileName,
            //        InputStream=file.OpenReadStream(),
            //        ContentType= file.ContentType,
            //};
            //var result = await this.amazonS3.PutObjectAsync(putRequest); 
            return Ok(response);

        }

    }
}
