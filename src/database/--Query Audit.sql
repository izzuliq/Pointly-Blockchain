--Query Audit
--1. Audit Logging
USE master;
GO

CREATE SERVER AUDIT FailedLoginAudit
TO FILE (FILEPATH = 'C:\AuditLogs\');


CREATE SERVER AUDIT SPECIFICATION FailedLoginAuditSpec
FOR SERVER AUDIT FailedLoginAudit
ADD (FAILED_LOGIN_GROUP);


ALTER SERVER AUDIT SPECIFICATION FailedLoginAuditSpec
WITH (STATE = ON);


ALTER SERVER AUDIT FailedLoginAudit
WITH (STATE = ON);
+++++++++++++++++++++++++++
Use master;
Go
ALTER SERVER AUDIT SPECIFICATION FailedLoginAuditSpec
WITH (STATE = OFF);


ALTER SERVER AUDIT SPECIFICATION FailedLoginAuditSpec
FOR SERVER AUDIT FailedLoginAudit
ADD (SUCCESSFUL_LOGIN_GROUP);

ALTER SERVER AUDIT SPECIFICATION FailedLoginAuditSpec
WITH (STATE = ON);
+++++++++++++++++++++++++++
SELECT *
FROM sys.fn_get_audit_file('C:\AuditLogs\*', NULL, NULL);
++++++++++++++++++++++++++++++
SELECT *
FROM sys.server_audit_specification_details
WHERE audit_action_id = 'LGIS';




_________________________________


--2. Query Masking

Use Pointly;

ALTER TABLE Users
ALTER COLUMN email VARCHAR(255) MASKED WITH (FUNCTION = 'email()');

ALTER TABLE Users
ALTER COLUMN phone VARCHAR(15) MASKED WITH (FUNCTION = 'partial(0, "****", 4)');


ALTER TABLE Admins
ALTER COLUMN email VARCHAR(255) MASKED WITH (FUNCTION = 'email()');

ALTER TABLE Admins
ALTER COLUMN phone VARCHAR(20) MASKED WITH (FUNCTION = 'partial(0, "****", 4)');


+++++++++++++++++++++++++++++++++

Use Pointly;

SELECT email, phone FROM Users;
SELECT email, phone FROM Admins;


_______________________________

--5.Query TDE

USE master;
CREATE CERTIFICATE TDE_Certificate 
WITH SUBJECT = 'TDE Certificate';

++++++++++++++++++++++++++++++++
USE Pointly;
CREATE DATABASE ENCRYPTION KEY
WITH ALGORITHM = AES_256
ENCRYPTION BY SERVER CERTIFICATE TDE_Certificate;

__________________________________

--6.Query SA Disable

ALTER LOGIN sa DISABLE;

++++++++++++++++++++++++++++++
SELECT name, is_disabled
FROM sys.sql_logins
WHERE name = 'sa';

_________________________________


--8. Query Code Signing


USE Pointly;
GO

CREATE PROCEDURE AddNewUser
    @Name NVARCHAR(100),
    @Email NVARCHAR(255),
    @Phone NVARCHAR(15),
    @Password NVARCHAR(255) -- Add a parameter for the password
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Insert into the Users table
        INSERT INTO Users (name, email, phone, password)
        VALUES (@Name, @Email, @Phone, @Password);

        PRINT 'User added successfully.';
    END TRY
    BEGIN CATCH
        -- Handle errors
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

+++++++++++++++++++


-- Create a certificate in the database
CREATE CERTIFICATE CodeSigningCert
WITH SUBJECT = 'Code signing certificate for stored procedures';
GO

+++++++++++++++++++++

-- Sign the stored procedure with the certificate
ADD SIGNATURE TO OBJECT::dbo.AddNewUser
BY CERTIFICATE CodeSigningCert;
GO

++++++++++++++++++


-- Grant execute permissions to the user
GRANT EXECUTE ON dbo.AddNewUser TO CodeSignerUser;
GO

+++++++++++++++++++++
EXECUTE AS USER = 'TestUser';

-- Try to execute the procedure
EXEC dbo.AddNewUser @Name = 'John', @Email = 'john@example.com', @Phone = '1234567890';
