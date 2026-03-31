<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método inválido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Validar campos obrigatórios do formulário
if (
    empty($data['company']) ||
    empty($data['nif']) ||
    empty($data['sector']) ||
    empty($data['country']) ||
    empty($data['phone']) ||
    empty($data['firstName']) ||
    empty($data['lastName']) ||
    empty($data['email']) ||
    empty($data['password'])
) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Dados incompletos. Preencha todos os campos obrigatórios.',
        'received' => array_keys($data)
    ]);
    exit;
}

// Sanitizar dados da empresa
$company = htmlspecialchars($data['company']);
$nif = htmlspecialchars($data['nif']);
$sector = htmlspecialchars($data['sector']);
$country = htmlspecialchars($data['country']);
$phone = htmlspecialchars($data['phone']);

// Sanitizar dados do responsável
$firstName = htmlspecialchars($data['firstName']);
$lastName = htmlspecialchars($data['lastName']);
$fullName = $firstName . ' ' . $lastName;
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$role = isset($data['role']) && !empty($data['role']) ? htmlspecialchars($data['role']) : 'Não informado';
$password = $data['password']; // Manter a password original

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email inválido.']);
    exit;
}

// Definir o destino (ALTERE PARA SEU EMAIL)
$destino = 'suporte@avesell.com'; // Mude para o email onde quer receber os registos

$mail = new PHPMailer(true);

try {
    // ===== CONFIGURAÇÃO SMTP TITAN =====
    $mail->isSMTP();
    $mail->Host       = 'smtp.titan.email';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'suporte@avesell.com';
    $mail->Password   = '@Avesell1722';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // Remetente e destinatário
    $mail->setFrom('suporte@avesell.com', 'Sistema de Registo Avesell');
    $mail->addAddress($destino);
    $mail->addReplyTo($email, $fullName);

    // Conteúdo do email
    $mail->isHTML(true);
    $mail->Subject = "NOVO REGISTO - $company";
    
    // Corpo do email em HTML com a password incluída
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h2 { margin: 0; font-size: 24px; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; }
            .section { margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #667eea; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #667eea; display: flex; align-items: center; gap: 10px; }
            .field { margin: 10px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; display: inline-block; width: 180px; color: #555; }
            .value { display: inline-block; color: #333; }
            .badge { display: inline-block; padding: 3px 10px; background: #667eea; color: white; border-radius: 15px; font-size: 12px; }
            .password-box { 
                background: #f0f0f0; 
                padding: 10px; 
                border-radius: 5px; 
                font-family: monospace; 
                font-size: 14px;
                margin-top: 5px;
                border: 1px solid #ddd;
            }
            .footer { margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px; text-align: center; }
            .footer p { margin: 0; color: #856404; }
            .warning { background: #ffebee; border-left: 4px solid #f44336; padding: 10px; margin-top: 15px; border-radius: 5px; }
            .warning p { margin: 0; color: #c62828; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>📋 NOVO REGISTO DE LOJA</h2>
                <p style='margin: 5px 0 0; opacity: 0.9;'>Avesell - Plataforma de E-commerce</p>
            </div>
            
            <div class='content'>
                <div class='section'>
                    <div class='section-title'>
                        <span>🏢</span> Dados da Empresa
                    </div>
                    <div class='field'>
                        <span class='label'>Nome da Empresa:</span>
                        <span class='value'><strong>$company</strong></span>
                    </div>
                    <div class='field'>
                        <span class='label'>NIF / NIPC:</span>
                        <span class='value'>$nif</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Categoria:</span>
                        <span class='value'><span class='badge'>$sector</span></span>
                    </div>
                    <div class='field'>
                        <span class='label'>País:</span>
                        <span class='value'>$country</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Telefone:</span>
                        <span class='value'>$phone</span>
                    </div>
                </div>
                
                <div class='section'>
                    <div class='section-title'>
                        <span>👤</span> Dados do Responsável
                    </div>
                    <div class='field'>
                        <span class='label'>Nome Completo:</span>
                        <span class='value'><strong>$fullName</strong></span>
                    </div>
                    <div class='field'>
                        <span class='label'>Cargo/Função:</span>
                        <span class='value'>$role</span>
                    </div>
                    <div class='field'>
                        <span class='label'>Email:</span>
                        <span class='value'><a href='mailto:$email'>$email</a></span>
                    </div>
                    <div class='field'>
                        <span class='label'>Password:</span>
                        <div class='password-box'>$password</div>
                    </div>
                </div>
                
                <div class='warning'>
                    <p>⚠️ <strong>IMPORTANTE:</strong> Guarde esta password em local seguro. Este email será apagado após o registo ser processado.</p>
                </div>
                
                <div class='footer'>
                    <p>✅ Este registo requer ativação manual.<br>
                    Por favor, verifique os dados e active a conta do cliente.</p>
                    <p style='margin-top: 10px; font-size: 12px;'>📅 Data do registo: " . date('d/m/Y H:i:s') . "</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Versão em texto simples com a password
    $mail->AltBody = "
    NOVO REGISTO DE LOJA - Avesell
    =================================
    
    DADOS DA EMPRESA:
    Nome: $company
    NIF: $nif
    Categoria: $sector
    País: $country
    Telefone: $phone
    
    DADOS DO RESPONSÁVEL:
    Nome: $fullName
    Cargo: $role
    Email: $email
    PASSWORD: $password
    
    =================================
    Data do registo: " . date('d/m/Y H:i:s') . "
    
    IMPORTANTE: Guarde esta password em local seguro.
    Este registo requer ativação manual.
    ";

    $mail->send();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Registo enviado com sucesso! Entraremos em contacto em breve.'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao enviar registo. Por favor, tente novamente mais tarde.'
    ]);
    
    // Log do erro para debug
    error_log("Erro no envio de email: " . $mail->ErrorInfo);
}
?>