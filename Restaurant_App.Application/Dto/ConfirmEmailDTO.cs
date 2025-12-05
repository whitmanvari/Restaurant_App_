using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaurant_App.Application.Dto
{
    public class ConfirmEmailDTO
    {
        public string UserId { get; set; }
        public string Token { get; set; }
    }
}
