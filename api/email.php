<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Ajusta o caminho para o PHPMailer (volta uma pasta e entra em PHPMailer)
require_once dirname(__DIR__) . '/PHPMailer/src/PHPMailer.php';
require_once dirname(__DIR__) . '/PHPMailer/src/SMTP.php';
require_once dirname(__DIR__) . '/PHPMailer/src/Exception.php';

// Configuração de cabeçalhos para resposta AJAX
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método inválido']);
    exit;
}

// Validar campos obrigatórios
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Array de erros
$errors = [];

// Validações
if (empty($name)) {
    $errors[] = 'Por favor, informe o seu nome.';
} elseif (strlen($name) < 3) {
    $errors[] = 'O nome deve ter pelo menos 3 caracteres.';
}

if (empty($email)) {
    $errors[] = 'Por favor, informe o seu email.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Por favor, informe um email válido.';
}

if (empty($subject)) {
    $errors[] = 'Por favor, informe o assunto.';
} elseif (strlen($subject) < 3) {
    $errors[] = 'O assunto deve ter pelo menos 3 caracteres.';
}

if (empty($message)) {
    $errors[] = 'Por favor, escreva a sua mensagem.';
} elseif (strlen($message) < 10) {
    $errors[] = 'A mensagem deve ter pelo menos 10 caracteres.';
}

// Se houver erros, retornar
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// Sanitizar dados
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Configuração do destinatário
$to = 'suporte@avesell.com'; // ALTERA PARA O TEU EMAIL
$adminEmail = 'suporte@avesell.com'; // Email que vai enviar (SMTP)

// Inicializar PHPMailer
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
    $mail->setFrom($adminEmail, 'Formulário de Contacto');
    $mail->addAddress($to);
    $mail->addReplyTo($email, $name);
    
    // Conteúdo do email
    $mail->isHTML(true);
    $mail->Subject = "📧 Nova Mensagem de Contacto - $subject";
    
    // Corpo do email em HTML
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Segoe UI', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h2 {
                margin: 0;
                font-size: 24px;
            }
            .header p {
                margin: 10px 0 0;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .info-section {
                margin-bottom: 25px;
                border-bottom: 1px solid #eee;
                padding-bottom: 20px;
            }
            .info-title {
                font-size: 18px;
                font-weight: bold;
                color: #667eea;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .info-row {
                margin: 12px 0;
                display: flex;
                align-items: flex-start;
            }
            .info-label {
                font-weight: bold;
                min-width: 100px;
                color: #555;
            }
            .info-value {
                color: #333;
                flex: 1;
                word-break: break-word;
            }
            .message-box {
                background: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 15px;
                margin-top: 10px;
                border-radius: 8px;
            }
            .message-box p {
                margin: 0;
                white-space: pre-wrap;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #eee;
            }
            .badge {
                display: inline-block;
                background: #e8f5e9;
                color: #4caf50;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>📬 Nova Mensagem de Contacto</h2>
                <p>Recebida através do formulário do site</p>
            </div>
            
            <div class='content'>
                <div class='info-section'>
                    <div class='info-title'>
                        📋 Informações do Remetente
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>Nome:</div>
                        <div class='info-value'>$name</div>
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>Email:</div>
                        <div class='info-value'>
                            <a href='mailto:$email'>$email</a>
                        </div>
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>Assunto:</div>
                        <div class='info-value'>$subject</div>
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>Data/Hora:</div>
                        <div class='info-value'>" . date('d/m/Y H:i:s') . "</div>
                    </div>
                    <div class='info-row'>
                        <div class='info-label'>IP:</div>
                        <div class='info-value'>" . $_SERVER['REMOTE_ADDR'] . "</div>
                    </div>
                </div>
                
                <div class='info-section'>
                    <div class='info-title'>
                        💬 Mensagem
                    </div>
                    <div class='message-box'>
                        <p>" . nl2br($message) . "</p>
                    </div>
                </div>
                
                <div class='badge'>
                    ⚡ Mensagem enviada através do site
                </div>
            </div>
            
            <div class='footer'>
                <p>Esta mensagem foi enviada automaticamente pelo formulário de contacto.</p>
                <p>© " . date('Y') . " - Sistema de Contacto</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Versão em texto simples
    $mail->AltBody = "
    NOVA MENSAGEM DE CONTACTO
    =========================
    
    Nome: $name
    Email: $email
    Assunto: $subject
    Data: " . date('d/m/Y H:i:s') . "
    IP: " . $_SERVER['REMOTE_ADDR'] . "
    
    MENSAGEM:
    ----------------------------------------
    $message
    ----------------------------------------
    
    Esta mensagem foi enviada através do formulário de contacto do site.
    ";
    
    // Enviar email principal
    $mail->send();
    
    // Enviar email de confirmação para o remetente
    try {
        $confirmMail = new PHPMailer(true);
        $confirmMail->isSMTP();
        $confirmMail->Host       = 'smtp.titan.email';
        $confirmMail->SMTPAuth   = true;
        $confirmMail->Username   = 'suporte@avesell.com';
        $confirmMail->Password   = '@Avesell1722';
        $confirmMail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $confirmMail->Port       = 587;
        $confirmMail->CharSet    = 'UTF-8';
        
        $confirmMail->setFrom('suporte@avesell.com', 'Avesell');
        $confirmMail->addAddress($email, $name);
        $confirmMail->isHTML(true);
        $confirmMail->Subject = '✅ Recebemos a sua mensagem - Avesell';
        $confirmMail->Body = "
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 500px; margin: 0 auto; padding: 20px; }
                .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { padding: 20px; background: #f9f9f9; border-radius: 0 0 8px 8px; }
                .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                .message-preview { background: white; padding: 15px; border-left: 3px solid #4CAF50; margin: 15px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>✅ Mensagem Recebida!</h2>
                </div>
                <div class='content'>
                    <p>Olá <strong>$name</strong>,</p>
                    <p>Agradecemos o seu contacto! Recebemos a sua mensagem e responderemos o mais breve possível.</p>
                    
                    <div class='message-preview'>
                        <strong>Assunto:</strong> $subject<br><br>
                        <strong>Sua mensagem:</strong><br>
                        " . nl2br($message) . "
                    </div>
                    
                    <p>Atenciosamente,<br><strong>Equipa Avesell</strong></p>
                </div>
                <div class='footer'>
                    <p>Este é um email automático, por favor não responda diretamente.</p>
                </div>
            </div>
        </body>
        </html>
        ";
        $confirmMail->AltBody = "Olá $name,\n\nAgradecemos o seu contacto! Recebemos a sua mensagem e responderemos o mais breve possível.\n\nAssunto: $subject\n\nMensagem:\n$message\n\nAtenciosamente,\nEquipa Avesell";
        
        $confirmMail->send();
    } catch (Exception $e) {
        // Não falha o envio principal se a confirmação falhar
        error_log("Erro ao enviar email de confirmação: " . $e->getMessage());
    }
    
    // Resposta de sucesso
    echo json_encode([
        'success' => true,
        'message' => 'Mensagem enviada com sucesso! Responderemos em breve.'
    ]);
    
} catch (Exception $e) {
    // Erro no envio
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.'
    ]);
    
    // Registrar erro no log
    error_log("Erro no envio de email: " . $e->getMessage());
}
?>